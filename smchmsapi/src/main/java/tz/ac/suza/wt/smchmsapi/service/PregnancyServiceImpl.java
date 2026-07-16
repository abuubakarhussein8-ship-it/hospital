package tz.ac.suza.wt.smchmsapi.service;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tz.ac.suza.wt.smchmsapi.model.Pregnancy;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.AncVisitRepository;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@Service
public class PregnancyServiceImpl implements PregnancyService {

    private final PregnancyRepository repo;
    private final UserRepository userRepository;
    private final AncVisitRepository ancVisitRepository;

    public PregnancyServiceImpl(PregnancyRepository repo, UserRepository userRepository, AncVisitRepository ancVisitRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.ancVisitRepository = ancVisitRepository;
    }

    @Override
    public Pregnancy create(Pregnancy p) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new AccessDeniedException("Authentication required");
        }

        if (isMotherRole(authentication)) {
            throw new AccessDeniedException("Mothers can only view pregnancy records and request appointments");
        }

        if (p.getMother() == null || p.getMother().getId() == null) {
            throw new RuntimeException("mother is required");
        }

        User mother = userRepository.findById(p.getMother().getId())
                .orElseThrow(() -> new RuntimeException("Mother not found"));
        if (mother.getRole() != UserRole.MOTHER) {
            throw new RuntimeException("Selected user must have MOTHER role");
        }
        p.setMother(mother);

        return repo.save(p);
    }

    @Override
    public List<Pregnancy> getAll() {
        ensureStaffAccess();
        return repo.findAll();
    }

    @Override
    public Pregnancy getById(UUID id) {
        Pregnancy pregnancy = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregnancy not found"));
        authorizeAccess(pregnancy);
        return pregnancy;
    }

    @Override
    public List<Pregnancy> getByMother(UUID motherId) {
        ensureAllowedMotherAccess(motherId);
        return repo.findByMotherId(motherId);
    }

    @Override
    public Pregnancy update(UUID id, Pregnancy p) {
        Pregnancy existing = getById(id);
        authorizeAccess(existing);

        if (isMotherRole(SecurityContextHolder.getContext().getAuthentication())) {
            throw new AccessDeniedException("Mothers can only view pregnancy records");
        }

        existing.setWeek(p.getWeek());
        existing.setLmp(p.getLmp());
        existing.setEdd(p.getEdd());
        existing.setRiskStatus(p.getRiskStatus());
        existing.setPregnancyStatus(p.getPregnancyStatus());

        if (p.getMother() == null || p.getMother().getId() == null) {
            throw new RuntimeException("mother is required");
        }
        User mother = userRepository.findById(p.getMother().getId())
                .orElseThrow(() -> new RuntimeException("Mother not found"));
        if (mother.getRole() != UserRole.MOTHER) {
            throw new RuntimeException("Selected user must have MOTHER role");
        }
        existing.setMother(mother);

        return repo.save(existing);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Pregnancy pregnancy = getById(id);
        authorizeAccess(pregnancy);
        if (isMotherRole(SecurityContextHolder.getContext().getAuthentication())) {
            throw new AccessDeniedException("Mothers can only view pregnancy records");
        }
        ancVisitRepository.deleteAllByPregnancyId(id);
        ancVisitRepository.flush();
        repo.deleteById(id);
    }

    @Override
    @Transactional
    public void adminCleanup(UUID id) {
        Pregnancy pregnancy = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregnancy not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        if (!hasRole(authentication, UserRole.ADMIN.name())) {
            throw new AccessDeniedException("Only admin can perform cleanup");
        }

        ancVisitRepository.deleteAllByPregnancyId(id);
        ancVisitRepository.flush();
        repo.delete(pregnancy);
    }

    private void ensureStaffAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        if (isStaffRole(authentication)) {
            return;
        }

        throw new AccessDeniedException("Only staff can access all pregnancies");
    }

    private void ensureAllowedMotherAccess(UUID motherId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        if (isStaffRole(authentication)) {
            return;
        }

        UUID currentUserId = currentUserId(authentication);
        if (currentUserId.equals(motherId)) {
            return;
        }

        throw new AccessDeniedException("You can only access your own pregnancies");
    }

    private void authorizeAccess(Pregnancy pregnancy) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        if (isStaffRole(authentication)) {
            return;
        }

        UUID currentUserId = currentUserId(authentication);
        User mother = pregnancy.getMother();
        if (mother != null && mother.getId() != null && currentUserId.equals(mother.getId())) {
            return;
        }

        throw new AccessDeniedException("You can only access your own pregnancies");
    }

    private boolean isStaffRole(Authentication authentication) {
        return hasRole(authentication, UserRole.ADMIN.name())
                || hasRole(authentication, UserRole.DOCTOR.name())
                || hasRole(authentication, UserRole.NURSE.name());
    }

    private boolean isMotherRole(Authentication authentication) {
        return hasRole(authentication, UserRole.MOTHER.name());
    }

    private boolean hasRole(Authentication authentication, String roleName) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String expected = "ROLE_" + roleName;
        return authorities.stream().anyMatch(authority -> expected.equals(authority.getAuthority()));
    }

    private UUID currentUserId(Authentication authentication) {
        Object credentials = authentication.getCredentials();
        if (credentials instanceof UUID userId) {
            return userId;
        }
        if (credentials instanceof String userId) {
            return UUID.fromString(userId);
        }
        throw new AccessDeniedException("Authenticated user id not available");
    }
}

package tz.ac.suza.wt.smchmsapi.service;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import tz.ac.suza.wt.smchmsapi.model.AncVisit;
import tz.ac.suza.wt.smchmsapi.model.Pregnancy;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.AncVisitRepository;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;

@Service
public class AncVisitServiceImpl implements AncVisitService {

    private final AncVisitRepository ancVisitRepository;
    private final PregnancyRepository pregnancyRepository;

    public AncVisitServiceImpl(AncVisitRepository ancVisitRepository, PregnancyRepository pregnancyRepository) {
        this.ancVisitRepository = ancVisitRepository;
        this.pregnancyRepository = pregnancyRepository;
    }

    @Override
    public AncVisit create(UUID pregnancyId, AncVisit visit) {
        ensureStaffAccess();
        Pregnancy pregnancy = pregnancyRepository.findById(pregnancyId)
                .orElseThrow(() -> new RuntimeException("Pregnancy not found"));
        visit.setPregnancy(pregnancy);
        return ancVisitRepository.save(visit);
    }

    @Override
    public List<AncVisit> getByPregnancy(UUID pregnancyId) {
        ensureAccess();
        return ancVisitRepository.findByPregnancyIdOrderByVisitDateAsc(pregnancyId);
    }

    private void ensureAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }
    }

    private void ensureStaffAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        if (hasRole(authentication, UserRole.ADMIN.name())
                || hasRole(authentication, UserRole.DOCTOR.name())
                || hasRole(authentication, UserRole.NURSE.name())) {
            return;
        }

        throw new AccessDeniedException("Only staff can create ANC visits");
    }

    private boolean hasRole(Authentication authentication, String roleName) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String expected = "ROLE_" + roleName;
        return authorities.stream().anyMatch(authority -> expected.equals(authority.getAuthority()));
    }
}

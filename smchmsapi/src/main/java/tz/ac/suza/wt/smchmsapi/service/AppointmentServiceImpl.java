package tz.ac.suza.wt.smchmsapi.service;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import tz.ac.suza.wt.smchmsapi.model.Appointment;
import tz.ac.suza.wt.smchmsapi.model.AppointmentStatus;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.AppointmentRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Appointment> getAll() {
        ensureStaffAccess();
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getMine() {
        Authentication authentication = currentAuthentication();
        return appointmentRepository.findByMotherId(currentUserId(authentication));
    }

    @Override
    public Appointment create(Appointment appointment) {
        Authentication authentication = currentAuthentication();

        if (appointment.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("appointmentDate must be today or later");
        }

        if (hasRole(authentication, UserRole.MOTHER.name())) {
            User currentMother = userRepository.findById(currentUserId(authentication))
                    .orElseThrow(() -> new AccessDeniedException("Authenticated mother not found"));
            appointment.setMother(currentMother);
        } else {
            if (appointment.getMother() == null || appointment.getMother().getId() == null) {
                throw new RuntimeException("mother is required");
            }
            User mother = userRepository.findById(appointment.getMother().getId())
                    .orElseThrow(() -> new RuntimeException("Mother not found"));
            if (mother.getRole() != UserRole.MOTHER) {
                throw new RuntimeException("Selected user must have MOTHER role");
            }
            appointment.setMother(mother);
        }

        appointment.setStatus(AppointmentStatus.PENDING);
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            appointment.setDoctor(findDoctor(appointment.getDoctor().getId()));
        } else {
            appointment.setDoctor(null);
        }
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment updateStatus(UUID id, AppointmentStatus status, UUID doctorId, String notes) {
        ensureStaffAccess();

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        appointment.setNotes(notes);

        if (doctorId != null) {
            appointment.setDoctor(findDoctor(doctorId));
        } else {
            appointment.setDoctor(null);
        }

        return appointmentRepository.save(appointment);
    }

    private User findDoctor(UUID doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        if (doctor.getRole() != UserRole.DOCTOR) {
            throw new RuntimeException("Selected user must have DOCTOR role");
        }
        return doctor;
    }

    private void ensureStaffAccess() {
        Authentication authentication = currentAuthentication();
        if (hasRole(authentication, UserRole.ADMIN.name())
                || hasRole(authentication, UserRole.DOCTOR.name())
                || hasRole(authentication, UserRole.NURSE.name())) {
            return;
        }
        throw new AccessDeniedException("Only staff can access all appointments");
    }

    private Authentication currentAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }
        return authentication;
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

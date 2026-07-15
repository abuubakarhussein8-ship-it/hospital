package tz.ac.suza.wt.smchmsapi.service;

import org.springframework.stereotype.Service;

import tz.ac.suza.wt.smchmsapi.dto.DashboardResponseDTO;
import tz.ac.suza.wt.smchmsapi.model.AppointmentStatus;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.AppointmentRepository;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final PregnancyRepository pregnancyRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                PregnancyRepository pregnancyRepository,
                                AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public DashboardResponseDTO getDashboard() {

        long totalUsers = userRepository.count();
        long totalMothers = userRepository.countByRole(UserRole.MOTHER);
        long totalDoctors = userRepository.countByRole(UserRole.DOCTOR);
        long totalNurses = userRepository.countByRole(UserRole.NURSE);
        long totalPregnancies = pregnancyRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);

        return new DashboardResponseDTO(
                totalUsers,
                totalMothers,
                totalDoctors,
                totalNurses,
                totalPregnancies,
                totalAppointments,
                pendingAppointments
        );
    }
}

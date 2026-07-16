package tz.ac.suza.wt.smchmsapi.service;

import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import tz.ac.suza.wt.smchmsapi.model.Appointment;
import tz.ac.suza.wt.smchmsapi.model.Pregnancy;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.repository.AppointmentRepository;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

class UserServiceImplTest {

    @Test
    void deleteUserRemovesRelatedRecordsBeforeDeletingUser() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AppointmentRepository appointmentRepository = mock(AppointmentRepository.class);
        PregnancyRepository pregnancyRepository = mock(PregnancyRepository.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);

        UserServiceImpl service = new UserServiceImpl(
                userRepository,
                passwordEncoder,
                appointmentRepository,
                pregnancyRepository,
                jdbcTemplate
        );

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        Appointment appointment = new Appointment();
        Pregnancy pregnancy = new Pregnancy();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(appointmentRepository.findByMotherId(userId)).thenReturn(List.of(appointment));
        when(pregnancyRepository.findByMotherId(userId)).thenReturn(List.of(pregnancy));
        when(jdbcTemplate.queryForList(
                "select 1 from information_schema.tables where table_name = 'children' limit 1"
        )).thenReturn(List.of());

        service.deleteUser(userId);

        InOrder inOrder = inOrder(appointmentRepository, pregnancyRepository, userRepository);
        inOrder.verify(appointmentRepository).deleteAll(List.of(appointment));
        inOrder.verify(pregnancyRepository).deleteAll(List.of(pregnancy));
        inOrder.verify(userRepository).delete(user);
    }
}

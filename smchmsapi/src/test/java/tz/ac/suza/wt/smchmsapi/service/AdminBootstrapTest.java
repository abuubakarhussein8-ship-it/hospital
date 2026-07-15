package tz.ac.suza.wt.smchmsapi.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

class AdminBootstrapTest {

    @Test
    void createsDefaultAdminWhenNoUsersExist() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AdminBootstrap bootstrap = new AdminBootstrap(userRepository, passwordEncoder);

        when(userRepository.countByRole(UserRole.ADMIN)).thenReturn(0L);
        when(passwordEncoder.encode("Admin123!")) .thenReturn("encoded-password");
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        bootstrap.initializeAdminIfMissing();

        verify(userRepository).save(any());
    }
}

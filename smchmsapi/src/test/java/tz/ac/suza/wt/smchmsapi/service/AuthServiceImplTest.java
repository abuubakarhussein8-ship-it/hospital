package tz.ac.suza.wt.smchmsapi.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import tz.ac.suza.wt.smchmsapi.dto.RegisterUserDTO;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;
import tz.ac.suza.wt.smchmsapi.security.JwtService;

class AuthServiceImplTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void mothersCanSelfRegister() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Mother One");
        request.setEmail("mother@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.MOTHER);

        when(userRepository.findByEmail("mother@example.com")).thenReturn(null);
        when(userRepository.count()).thenReturn(1L);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);

        User created = authService.register(request, authentication);

        assertEquals(UserRole.MOTHER, created.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registrationShouldNotPreAssignIdToAvoidPersistenceConflict() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setId(UUID.randomUUID());
        request.setName("Mother Two");
        request.setEmail("mother2@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.MOTHER);

        when(userRepository.findByEmail("mother2@example.com")).thenReturn(null);
        when(userRepository.count()).thenReturn(1L);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);

        authService.register(request, authentication);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals(null, captor.getValue().getId());
    }

    @Test
    void staffRegistrationRequiresAdminAuthentication() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Doctor One");
        request.setEmail("doctor@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.DOCTOR);

        when(userRepository.findByEmail("doctor@example.com")).thenReturn(null);

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getAuthorities()).thenReturn(Collections.emptyList());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request, authentication));

        assertEquals("Only admin can create admin, doctor, or nurse accounts.", ex.getMessage());
    }

    @Test
    void adminCannotCreateMotherAccount() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Mother Three");
        request.setEmail("mother3@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.MOTHER);

        when(userRepository.findByEmail("mother3@example.com")).thenReturn(null);

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))).when(authentication).getAuthorities();

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request, authentication));

        assertEquals("Only nurse can create mother accounts.", ex.getMessage());
    }

    @Test
    void nurseCanCreateMotherAccount() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Mother Four");
        request.setEmail("mother4@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.MOTHER);

        when(userRepository.findByEmail("mother4@example.com")).thenReturn(null);
        when(userRepository.count()).thenReturn(1L);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_NURSE"))).when(authentication).getAuthorities();

        User created = authService.register(request, authentication);

        assertEquals(UserRole.MOTHER, created.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void firstUserBecomesAdminWhenNoUsersExist() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Admin One");
        request.setEmail("admin@example.com");
        request.setPassword("secret123");
        request.setRole(UserRole.MOTHER);

        when(userRepository.findByEmail("admin@example.com")).thenReturn(null);
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);

        User created = authService.register(request, null);

        assertEquals(UserRole.ADMIN, created.getRole());
    }
}

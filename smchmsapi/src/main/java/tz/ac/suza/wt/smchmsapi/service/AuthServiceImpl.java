package tz.ac.suza.wt.smchmsapi.service;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tz.ac.suza.wt.smchmsapi.dto.LoginRequestDTO;
import tz.ac.suza.wt.smchmsapi.dto.LoginResponseDTO;
import tz.ac.suza.wt.smchmsapi.dto.RegisterUserDTO;
import tz.ac.suza.wt.smchmsapi.dto.ChangePasswordDTO;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;
import tz.ac.suza.wt.smchmsapi.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account was not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from the current password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                new JwtService.UUIDClaims(
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getRole().name()
                )
        );

        return new LoginResponseDTO(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

    }

    @Override
    public User register(RegisterUserDTO request, Authentication authentication) {
        User existing = userRepository.findByEmail(request.getEmail());
        if (existing != null) {
            throw new RuntimeException("Email already exists");
        }

        UserRole requestedRole = request.getRole() == null ? UserRole.MOTHER : request.getRole();

        boolean isAdminRequest = requestedRole == UserRole.ADMIN;
        boolean isStaffRequest = requestedRole == UserRole.DOCTOR || requestedRole == UserRole.NURSE;
        boolean isAuthenticatedAdmin = authentication != null && authentication.isAuthenticated()
                && authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (isAdminRequest || isStaffRequest) {
            if (!isAuthenticatedAdmin) {
                throw new RuntimeException("Only admin can create admin, doctor, or nurse accounts.");
            }
        }

        if (userRepository.count() == 0) {
            requestedRole = UserRole.ADMIN;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(requestedRole);

        User saved = userRepository.save(user);

        return saved;

    }
}

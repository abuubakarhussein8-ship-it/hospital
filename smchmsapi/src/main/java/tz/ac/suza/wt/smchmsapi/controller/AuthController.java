package tz.ac.suza.wt.smchmsapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tz.ac.suza.wt.smchmsapi.dto.LoginRequestDTO;
import tz.ac.suza.wt.smchmsapi.dto.LoginResponseDTO;
import tz.ac.suza.wt.smchmsapi.dto.RegisterUserDTO;
import tz.ac.suza.wt.smchmsapi.dto.ChangePasswordDTO;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO request, Authentication authentication) {
        authService.changePassword((java.util.UUID) authentication.getCredentials(), request);
        return ResponseEntity.ok(java.util.Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDTO request, Authentication authentication) {
        User created = authService.register(request, authentication);

        // Return fields zisizo nyeti (usiirudishe password hata kama ni hash).
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new java.util.LinkedHashMap<>() {{
                    put("id", created.getId());
                    put("name", created.getName());
                    put("email", created.getEmail());
                    put("role", created.getRole());
                    put("pregnancies", created.getPregnancies());
                }}
        );

    }

}

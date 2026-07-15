package tz.ac.suza.wt.smchmsapi.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@Component
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrap(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeAdminIfMissing() {
        if (userRepository.countByRole(UserRole.ADMIN) > 0) {
            return;
        }

        User admin = new User();
        // Neutral name to avoid any dashboard greeting like "Hello, System Admin Online".
        admin.setName("Admin");

        admin.setEmail("starmomsed@gmail.com");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        admin.setRole(UserRole.ADMIN);

        userRepository.save(admin);
    }
}

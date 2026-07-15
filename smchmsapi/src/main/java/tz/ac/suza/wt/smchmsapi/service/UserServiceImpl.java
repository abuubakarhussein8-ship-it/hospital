package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.AppointmentRepository;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;
    private final PregnancyRepository pregnancyRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           AppointmentRepository appointmentRepository,
                           PregnancyRepository pregnancyRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
        this.pregnancyRepository = pregnancyRepository;
    }

    @Override
    public User createUser(User user) {
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getMothers() {
        return userRepository.findByRole(UserRole.MOTHER);
    }

    @Override
    public List<User> getDoctors() {
        return userRepository.findByRole(UserRole.DOCTOR);
    }

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User createUserByAdmin(User user, String adminEmail) {
        // Placeholder rule: no real auth here (yet). Keep it simple for compilation.
        // You can later enforce role restrictions based on adminEmail.
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User registerMother(User user) {
        // Placeholder: allow only role=MOTHER if you want.
        userRepository.findById(user.getId());
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UUID id, User user) {
        User existing = getUserById(id);
        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPassword(hashPassword(user.getPassword()));
        existing.setRole(user.getRole());
        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointmentRepository.deleteAll(appointmentRepository.findByMotherId(id));
        pregnancyRepository.deleteAll(pregnancyRepository.findByMotherId(id));
        userRepository.delete(user);
    }

    private String hashPassword(String password) {
        if (password != null && password.startsWith("$2")) {
            return password;
        }
        return passwordEncoder.encode(password);
    }
}

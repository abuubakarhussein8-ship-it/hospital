package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final JdbcTemplate jdbcTemplate;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           AppointmentRepository appointmentRepository,
                           PregnancyRepository pregnancyRepository,
                           JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.jdbcTemplate = jdbcTemplate;
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
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointmentRepository.deleteAll(appointmentRepository.findByMotherId(id));
        pregnancyRepository.deleteAll(pregnancyRepository.findByMotherId(id));
        cleanupChildrenRows(id);
        userRepository.delete(user);
    }

    private void cleanupChildrenRows(UUID userId) {
        if (!jdbcTemplate.queryForList(
                "select 1 from information_schema.tables where table_name = 'children' limit 1"
        ).isEmpty()) {
            List<String> candidateColumns = List.of("user_id", "mother_id", "parent_id", "guardian_id");
            List<String> existingColumns = jdbcTemplate.queryForList(
                    "select column_name from information_schema.columns where table_name = 'children'",
                    String.class
            );

            for (String column : candidateColumns) {
                if (existingColumns.contains(column)) {
                    jdbcTemplate.update("delete from children where " + column + " = ?", userId);
                    break;
                }
            }
        }
    }

    private String hashPassword(String password) {
        if (password != null && password.startsWith("$2")) {
            return password;
        }
        return passwordEncoder.encode(password);
    }
}

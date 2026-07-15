package tz.ac.suza.wt.smchmsapi.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);

    long countByRole(UserRole role);

    List<User> findByRole(UserRole role);
}


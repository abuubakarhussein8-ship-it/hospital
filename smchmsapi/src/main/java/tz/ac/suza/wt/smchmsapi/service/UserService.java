package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import tz.ac.suza.wt.smchmsapi.model.User;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    List<User> getMothers();

    List<User> getDoctors();

    User getUserById(UUID id);

    User createUserByAdmin(User user, String adminEmail);

    User registerMother(User user);

    User updateUser(UUID id, User user);

    void deleteUser(UUID id);
}

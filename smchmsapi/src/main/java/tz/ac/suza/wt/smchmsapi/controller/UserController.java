package tz.ac.suza.wt.smchmsapi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.service.UserService;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/mothers")
    public ResponseEntity<List<User>> getMothers() {
        return ResponseEntity.ok(userService.getMothers());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /*
     * ADMIN ONLY: Register Doctor, Nurse, Mother
     */
    @PostMapping("/admin-create")
    public ResponseEntity<User> createByAdmin(
            @Valid @RequestBody User user,
            @RequestParam String adminEmail) {


        User created = userService.createUserByAdmin(user, adminEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /*
     * MOTHER SELF REGISTRATION
     */
    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.createUser(user));
    }


    // UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody User user) {


        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}

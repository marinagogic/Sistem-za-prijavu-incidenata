package org.unibl.etf.pisio.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.userservice.dto.AuthUserDTO;
import org.unibl.etf.pisio.userservice.dto.RegisterDTO;
import org.unibl.etf.pisio.userservice.dto.UserDTO;
import org.unibl.etf.pisio.userservice.model.Role;
import org.unibl.etf.pisio.userservice.model.User;
import org.unibl.etf.pisio.userservice.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getPrivilegedUsers() {
        List<UserDTO> users = userService.getAll().stream()
                .filter(user -> user.getRole() == Role.ADMIN || user.getRole() == Role.MODERATOR)
                .map(userService::toDTO)
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> findUserById(@PathVariable Long id) {
        Optional<User> optionalUser = userService.getById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userService.toDTO(optionalUser.get()));
    }

    @GetMapping("/search")
    public ResponseEntity<UserDTO> findByUsername(@RequestParam String username) {
        return userService.getByUsername(username)
                .map(user -> ResponseEntity.ok(userService.toDTO(user)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/internal/auth-user")
    public ResponseEntity<AuthUserDTO> findAuthUserByUsername(@RequestParam String username) {
        return userService.getByUsername(username)
                .map(user -> ResponseEntity.ok(userService.toAuthDTO(user)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> registerUser(@RequestBody RegisterDTO registerDTO) {
        User newUser = new User();
        newUser.setUsername(registerDTO.getUsername());
        newUser.setPassword(registerDTO.getPassword());
        newUser.setFirstName(registerDTO.getFirstName());
        newUser.setLastName(registerDTO.getLastName());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setRole(Role.USER);

        User createdUser = userService.create(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.toDTO(createdUser));
    }

    @PostMapping("/employee")
    public ResponseEntity<UserDTO> addEmployee(@RequestBody User user) {
        if (user.getRole() == null) {
            return ResponseEntity.badRequest().build();
        }

        boolean allowedRole = user.getRole() == Role.ADMIN || user.getRole() == Role.MODERATOR;
        if (!allowedRole) {
            return ResponseEntity.badRequest().build();
        }

        User createdEmployee = userService.create(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.toDTO(createdEmployee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUserData(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateSimple(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable Long id) {
        boolean deleted = userService.delete(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
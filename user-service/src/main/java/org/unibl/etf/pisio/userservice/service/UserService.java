package org.unibl.etf.pisio.userservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.userservice.dto.AuthUserDTO;
import org.unibl.etf.pisio.userservice.dto.UserDTO;
import org.unibl.etf.pisio.userservice.model.User;
import org.unibl.etf.pisio.userservice.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$");

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User create(User user) {
        checkPasswordStrength(user.getPassword());
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public UserDTO updateSimple(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setUsername(userDTO.getUsername());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());

        User updatedUser = userRepository.save(user);
        return toDTO(updatedUser);
    }

    public Optional<User> updateUser(Long id, User changedUser) {
        return userRepository.findById(id).map(existingUser -> {
            checkPasswordStrength(changedUser.getPassword());

            existingUser.setUsername(changedUser.getUsername());
            existingUser.setPassword(encoder.encode(changedUser.getPassword()));
            existingUser.setRole(changedUser.getRole());
            existingUser.setFirstName(changedUser.getFirstName());
            existingUser.setLastName(changedUser.getLastName());
            existingUser.setEmail(changedUser.getEmail());

            return userRepository.save(existingUser);
        });
    }

    public boolean delete(Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return false;
        }

        userRepository.delete(userOptional.get());
        return true;
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public AuthUserDTO toAuthDTO(User user) {
        AuthUserDTO dto = new AuthUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return dto;
    }

    private void checkPasswordStrength(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters, one uppercase letter, one number and one special character."
            );
        }
    }
}
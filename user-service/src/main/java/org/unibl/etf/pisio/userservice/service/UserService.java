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
        validateBasicFields(user, true);
        validateUniquenessForCreate(user);
        checkPasswordStrength(user.getPassword());

        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public UserDTO updateSimple(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        validateBasicFields(userDTO);
        validateUniquenessForUpdate(id, userDTO.getUsername(), userDTO.getEmail());

        user.setUsername(userDTO.getUsername());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());

        User updatedUser = userRepository.save(user);
        return toDTO(updatedUser);
    }

    public Optional<User> updateUser(Long id, User changedUser) {
        return userRepository.findById(id).map(existingUser -> {
            validateBasicFields(changedUser, false);
            validateUniquenessForUpdate(id, changedUser.getUsername(), changedUser.getEmail());

            existingUser.setUsername(changedUser.getUsername());
            existingUser.setRole(changedUser.getRole());
            existingUser.setFirstName(changedUser.getFirstName());
            existingUser.setLastName(changedUser.getLastName());
            existingUser.setEmail(changedUser.getEmail());

            if (!isBlank(changedUser.getPassword())) {
                checkPasswordStrength(changedUser.getPassword());
                existingUser.setPassword(encoder.encode(changedUser.getPassword()));
            }

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

    private void validateBasicFields(User user, boolean passwordRequired) {
        if (user == null) {
            throw new IllegalArgumentException("User data is required.");
        }

        if (isBlank(user.getUsername())) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (isBlank(user.getFirstName())) {
            throw new IllegalArgumentException("First name is required.");
        }
        if (isBlank(user.getLastName())) {
            throw new IllegalArgumentException("Last name is required.");
        }
        if (isBlank(user.getEmail())) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (passwordRequired && isBlank(user.getPassword())) {
            throw new IllegalArgumentException("Password is required.");
        }
    }

    private void validateBasicFields(UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("User data is required.");
        }

        if (isBlank(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (isBlank(userDTO.getFirstName())) {
            throw new IllegalArgumentException("First name is required.");
        }
        if (isBlank(userDTO.getLastName())) {
            throw new IllegalArgumentException("Last name is required.");
        }
        if (isBlank(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email is required.");
        }
    }

    private void validateUniquenessForCreate(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }
    }

    private void validateUniquenessForUpdate(Long id, String username, String email) {
        userRepository.findByUsername(username)
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        throw new IllegalArgumentException("Username already exists.");
                    }
                });

        userRepository.findByEmail(email)
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        throw new IllegalArgumentException("Email already exists.");
                    }
                });
    }

    private void checkPasswordStrength(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters, one uppercase letter, one number and one special character."
            );
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
package org.unibl.etf.pisio.authservice.controller;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.authservice.client.UserClient;
import org.unibl.etf.pisio.authservice.dto.AuthUserDTO;
import org.unibl.etf.pisio.authservice.dto.JwtDTO;
import org.unibl.etf.pisio.authservice.dto.LoginDTO;
import org.unibl.etf.pisio.authservice.dto.RegisterDTO;
import org.unibl.etf.pisio.authservice.dto.UserDTO;
import org.unibl.etf.pisio.authservice.security.JwtUtils;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserClient userClient, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userClient = userClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        if (loginDTO == null
                || isBlank(loginDTO.getUsername())
                || isBlank(loginDTO.getPassword())) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        try {
            AuthUserDTO authUser = userClient.getAuthUserByUsername(loginDTO.getUsername());

            if (authUser == null) {
                return invalidCredentialsResponse();
            }

            String storedPassword = authUser.getPassword();
            if (storedPassword == null || !passwordEncoder.matches(loginDTO.getPassword(), storedPassword)) {
                return invalidCredentialsResponse();
            }

            String jwt = jwtUtils.generateJwtToken(
                    authUser.getId(),
                    authUser.getUsername(),
                    Collections.singletonList(authUser.getRole())
            );

            JwtDTO jwtDTO = new JwtDTO(
                    jwt,
                    "Bearer",
                    authUser.getUsername(),
                    Collections.singletonList(authUser.getRole())
            );

            return ResponseEntity.ok(jwtDTO);

        } catch (FeignException.NotFound e) {
            return invalidCredentialsResponse();
        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        if (registerDTO == null
                || isBlank(registerDTO.getUsername())
                || isBlank(registerDTO.getPassword())
                || isBlank(registerDTO.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Username, password and email are required");
        }

        try {
            UserDTO savedUser = userClient.createUser(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (FeignException.BadRequest e) {
            String message = e.contentUTF8();

            if (message == null || message.trim().isEmpty()) {
                message = "Invalid registration data";
            }

            return ResponseEntity.badRequest().body(message);

        } catch (FeignException.Conflict e) {
            String message = e.contentUTF8();

            if (message == null || message.trim().isEmpty()) {
                message = "Username or email already exists";
            }

            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);

        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed");
        }
    }

    private ResponseEntity<String> invalidCredentialsResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
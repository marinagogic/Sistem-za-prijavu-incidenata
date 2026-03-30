package org.unibl.etf.pisio.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterDTO registerDTO) {
        UserDTO savedUser = userClient.createUser(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    private ResponseEntity<String> invalidCredentialsResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    }
}
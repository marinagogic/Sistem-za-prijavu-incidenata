package org.unibl.etf.pisio.authservice.dto;

import lombok.Data;

@Data
public class AuthUserDTO {
    private Long id;
    private String username;
    private String password;
    private String role;
}
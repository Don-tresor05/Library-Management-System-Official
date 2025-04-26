package com.system.Library_Backend.security;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
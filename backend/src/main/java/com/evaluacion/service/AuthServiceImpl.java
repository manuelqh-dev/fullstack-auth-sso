package com.evaluacion.service;

import com.evaluacion.dto.AuthResponse;
import com.evaluacion.dto.LoginRequest;
import com.evaluacion.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final JwtUtils jwtUtils;

    @Autowired
    public AuthServiceImpl(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse authenticate(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Validación mockeada de credenciales para prueba técnica
        if (isValidCredential(username, password)) {
            // Genera el token JWT usando el componente JwtUtils
            String token = jwtUtils.generateJwtToken(username);
            return new AuthResponse(token, username);
        } else {
            throw new RuntimeException("Credenciales inválidas. Usuario o contraseña incorrectos.");
        }
    }

    private boolean isValidCredential(String username, String password) {
        // Acepta credenciales de prueba predefinidas
        return ("admin".equals(username) && "admin123".equals(password)) ||
                ("user".equals(username) && "user123".equals(password));
    }

}

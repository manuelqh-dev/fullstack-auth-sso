package com.evaluacion.service;

import com.evaluacion.dto.AuthResponse;
import com.evaluacion.dto.LoginRequest;

public interface AuthService {

    /**
     * Procesa las credenciales enviadas por el usuario y genera la respuesta con el token JWT.
     *
     * @param loginRequest Objeto DTO con el usuario y la contraseña.
     * @return AuthResponse DTO que contiene el token JWT y la información del usuario.
     */
    AuthResponse authenticate(LoginRequest loginRequest);
}

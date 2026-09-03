package com.evaluacion.controller;

import com.evaluacion.dto.AuthResponse;
import com.evaluacion.dto.LoginRequest;
import com.evaluacion.dto.SsoCallbackRequest;
import com.evaluacion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend (CORS)
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para autenticar usuarios y obtener el token JWT.
     *
     * @param loginRequest DTO con las credenciales enviadas en el body.
     * @return ResponseEntity con el token JWT en caso de éxito o error 401 si las credenciales son incorrectas.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.authenticate(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // --- ENDPOINT 1: Inicio de flujo SSO ---
    @GetMapping("/sso")
    public ResponseEntity<Map<String, String>> initiateSso() {
        // Generamos la URL a la que se redirigirá el cliente Angular (el callback con el código simulado)
        String ssoRedirectUrl = "http://localhost:4200/sso/callback?code=DECATHLON_SIMULATED_AUTH_CODE_12345";

        return ResponseEntity.ok(Collections.singletonMap("redirectUrl", ssoRedirectUrl));
    }

    // --- ENDPOINT 2: Callback SSO para validar el código y emitir JWT ---
    @PostMapping("/sso/callback")
    public ResponseEntity<?> handleSsoCallback(@RequestBody SsoCallbackRequest request) {
        // Simulamos la validación del código recibido
        if (request.getCode() != null && !request.getCode().trim().isEmpty()) {
            // Autenticamos al usuario SSO usando el servicio
            AuthResponse response = authService.authenticateSsoUser("decathlon.user");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Código de autorización SSO inválido"));
        }
    }
}

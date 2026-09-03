package com.evaluacion.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Verifica que el login tradicional con credenciales válidas retorna estado 200 OK,
     * junto con el token JWT y el nombre de usuario correspondiente.
     */
    @Test
    public void shouldReturnTokenWhenCredentialsAreValid() throws Exception {
        String loginPayload = "{\"username\":\"admin@econocom.com\",\"password\":\"admin123\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("admin@econocom.com"));
    }

    /**
     * Verifica que el login tradicional con credenciales erróneas es rechazado
     * devolviendo un estado HTTP 401 Unauthorized.
     */
    @Test
    public void shouldReturnUnauthorizedWhenCredentialsAreInvalid() throws Exception {
        String invalidPayload = "{\"username\":\"admin\",\"password\":\"wrongpassword\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Verifica que la iniciación del flujo SSO (GET /api/auth/sso) retorna un 200 OK
     * y el JSON con la propiedad 'redirectUrl'.
     */
    @Test
    public void shouldReturnRedirectUrlWhenInitiatingSso() throws Exception {
        mockMvc.perform(get("/api/auth/sso"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.redirectUrl").exists());
    }

    /**
     * Verifica que el callback de SSO (POST /api/auth/sso/callback) con un código válido
     * autentica al usuario devolviendo un 200 OK y su correspondiente token JWT.
     */
    @Test
    public void shouldReturnTokenWhenSsoCodeIsValid() throws Exception {
        String ssoPayload = "{\"code\":\"DECATHLON_SIMULATED_AUTH_CODE_12345\"}";

        mockMvc.perform(post("/api/auth/sso/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ssoPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").exists());
    }

    /**
     * Verifica que el callback de SSO con un código vacío o inválido
     * es rechazado con un estado HTTP 401 Unauthorized.
     */
    @Test
    public void shouldReturnUnauthorizedWhenSsoCodeIsInvalid() throws Exception {
        String invalidSsoPayload = "{\"code\":\"\"}";

        mockMvc.perform(post("/api/auth/sso/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSsoPayload))
                .andExpect(status().isUnauthorized());
    }
}

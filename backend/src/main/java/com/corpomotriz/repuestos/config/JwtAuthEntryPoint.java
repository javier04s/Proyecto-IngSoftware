package com.corpomotriz.repuestos.config; // <--- ¡Paquete correcto según tu estructura!

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        System.err.println("ERROR: Unauthorized access - " + authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Acceso no autorizado. Por favor, proporcione un token JWT válido.");
    }
}
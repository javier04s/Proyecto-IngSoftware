package com.corpomotriz.repuestos.jwt;

import com.corpomotriz.repuestos.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            logger.debug("Token JWT extraído del request: {}", (jwt != null ? jwt.substring(0, Math.min(jwt.length(), 30)) + "..." : "null"));

            if (StringUtils.hasText(jwt)) {
                boolean isValid = jwtService.validateToken(jwt);
                logger.debug("Token válido según JwtService.validateToken(): {}", isValid);

                if (isValid) {
                    String username = jwtService.getUsernameFromToken(jwt);
                    String role = jwtService.getRoleFromToken(jwt);
                    logger.debug("Username del token: {}, Rol: {}", username, role);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    logger.debug("UserDetails cargados: {}, Authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Autenticación establecida en SecurityContextHolder para el usuario: {}", username);
                } else {
                    logger.warn("Token no válido o expirado. No se establecerá la autenticación.");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token JWT inválido o expirado");
                    return; // Detener el filtro
                }
            } else {
                logger.debug("No se encontró token JWT en la cabecera Authorization.");
            }
        } catch (Exception ex) {
            logger.error("Excepción al procesar token JWT: ", ex);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno en autenticación JWT");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

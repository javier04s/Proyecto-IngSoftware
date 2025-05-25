package com.corpomotriz.repuestos.jwt; // <--- ¡Nuevo paquete recomendado!

import com.corpomotriz.repuestos.service.JwtService;
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

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("DEBUG Filter: Token JWT extraído del request: " + (jwt != null ? jwt.substring(0, Math.min(jwt.length(), 30)) + "..." : "null"));

            if (StringUtils.hasText(jwt)) {
                boolean isValid = jwtService.validateToken(jwt);
                System.out.println("DEBUG Filter: Token válido según JwtService.validateToken(): " + isValid);

                if (isValid) {
                    String username = jwtService.getUsernameFromToken(jwt);
                    String role = jwtService.getRoleFromToken(jwt);
                    System.out.println("DEBUG Filter: Username del token: " + username + ", Rol: " + role);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println("DEBUG Filter: UserDetails cargados: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("DEBUG Filter: Autenticación establecida en SecurityContextHolder para el usuario: " + username);
                } else {
                    System.out.println("DEBUG Filter: Token no válido o expirado. No se establecerá la autenticación.");
                }
            } else {
                System.out.println("DEBUG Filter: No se encontró token JWT en la cabecera Authorization.");
            }
        } catch (Exception ex) {
            System.err.println("ERROR Filter: Excepción al procesar token JWT: " + ex.getMessage());
            ex.printStackTrace();
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
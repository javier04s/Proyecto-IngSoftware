package com.corpomotriz.repuestos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Deshabilita CSRF para APIs REST
                .cors(withDefaults())           // Habilita CORS con configuración por defecto
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()   // Permite todas las peticiones sin autenticación
                );

        return http.build();
    }
}

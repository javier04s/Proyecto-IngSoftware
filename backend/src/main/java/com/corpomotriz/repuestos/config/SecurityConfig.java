package com.corpomotriz.repuestos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Activa configuración CORS
                .csrf(csrf -> csrf.disable()) // Desactiva CSRF para APIs REST
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login").permitAll() // Permitir login sin autenticación
                        .requestMatchers("/usuarios").permitAll()
                        .requestMatchers(HttpMethod.POST, "/productos").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/productos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/proveedores/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/proveedores").permitAll()
                        .requestMatchers(HttpMethod.POST, "/pagos").hasAnyRole("CLIENTE", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/pagos/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/perfil/**").hasRole("ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults());

        return http.build();
    }

    // Configuración CORS personalizada para permitir solicitudes desde Angular
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200")); // Origen frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

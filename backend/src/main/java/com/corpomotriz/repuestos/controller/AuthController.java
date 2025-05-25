package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.request.LoginRequestDTO;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import com.corpomotriz.repuestos.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        // Buscar usuario por email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            // Usuario no encontrado
            return ResponseEntity.status(401).body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        // Validar contraseña usando passwordEncoder (asegura comparación segura)
        if (!passwordEncoder.matches(loginRequest.getContrasena(), usuario.getContrasena())) {
            // Contraseña incorrecta
            return ResponseEntity.status(401).body(Map.of("message", "Contraseña incorrecta"));
        }

        // Obtener rol del usuario para incluir en el token
        String rol = usuario.getRol();

        // Generar token JWT con usuario y rol
        String token = jwtService.generateToken(usuario.getEmail(), rol);

        // Retornar respuesta con información del usuario y el token JWT
        return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "usuario", Map.of(
                        "id", usuario.getId(),
                        "nombre", usuario.getNombre(),
                        "email", usuario.getEmail(),
                        "rol", rol
                ),
                "token", token
        ));
    }

}

package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.request.LoginRequestDTO;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginRequest.getContrasena(), usuario.getContrasena())) {
            return ResponseEntity.status(401).body(Map.of("message", "Contraseña incorrecta"));
        }

        // Login exitoso: devolvemos un objeto JSON con éxito y datos de usuario
        return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "usuario", Map.of(
                        "id", usuario.getId(),
                        "nombre", usuario.getNombre(),
                        "email", usuario.getEmail(),
                        "rol", usuario.getRol()
                )
        ));
    }
}

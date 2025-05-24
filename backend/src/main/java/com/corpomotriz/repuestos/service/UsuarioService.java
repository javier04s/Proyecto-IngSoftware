package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.crear.UsuarioCrearDTO;
import com.corpomotriz.repuestos.dto.UsuarioDTO;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirAUsuarioDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::convertirAUsuarioDTO);
    }

    public UsuarioDTO createUser(UsuarioCrearDTO usuarioCrearDTO) {
        Usuario usuario = Usuario.builder()
                .nombre(usuarioCrearDTO.getNombre())
                .email(usuarioCrearDTO.getEmail())
                .contrasena(passwordEncoder.encode(usuarioCrearDTO.getContrasena()))
                .rol(usuarioCrearDTO.getRol() != null ? usuarioCrearDTO.getRol() : "CLIENTE")
                .fechaCreacion(LocalDateTime.now())
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return convertirAUsuarioDTO(usuarioGuardado);
    }

    public String getUserRoleByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(Usuario::getRol)
                .orElse("SIN_ROL");
    }

    private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(Math.toIntExact(usuario.getId()))
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }
}

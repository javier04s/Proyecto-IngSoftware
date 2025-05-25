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

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<UsuarioDTO> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::toDTO);
    }

    public UsuarioDTO createUser(UsuarioCrearDTO dto) {
        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .contrasena(passwordEncoder.encode(dto.getContrasena()))
                .rol(dto.getRol() != null ? dto.getRol() : "CLIENTE")
                .fechaCreacion(LocalDateTime.now())
                .build();

        return toDTO(usuarioRepository.save(usuario));
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId().intValue())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }
}

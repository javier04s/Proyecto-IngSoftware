package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.crear.UsuarioCrearDTO;
import com.corpomotriz.repuestos.dto.UsuarioDTO;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::toDTO);
    }

    public UsuarioDTO createUser(UsuarioCrearDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .contrasena(dto.getContrasena())
                .rol(dto.getRol())
                .fechaCreacion(LocalDateTime.now()) // Se establece solo al crear
                .build();

        return toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO updateUser(Integer id, UsuarioCrearDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getEmail().equals(dto.getEmail()) &&
                usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRol(dto.getRol());
        // NO MODIFICAR usuario.setFechaCreacion(dto.getFechaCreacion());
        // La fecha de creación no se actualiza aquí, se mantiene la original.

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    public void deleteUser(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
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
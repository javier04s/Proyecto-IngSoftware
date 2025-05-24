package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.UsuarioCrearDTO;
import com.corpomotriz.repuestos.dto.UsuarioDTO;
import com.corpomotriz.repuestos.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Crear perfil
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearPerfil(@Valid @RequestBody UsuarioCrearDTO usuarioCrearDTO) {
        UsuarioDTO nuevoUsuario = usuarioService.createUser(usuarioCrearDTO);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // Examinar perfil
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Integer id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}

package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.request.InventarioRequestDTO;
import com.corpomotriz.repuestos.dto.response.InventarioResponseDTO;
import com.corpomotriz.repuestos.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventarios")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<InventarioResponseDTO>> getAllInventarios() {
        List<InventarioResponseDTO> lista = inventarioService.getAllInventarios();
        return ResponseEntity.ok(lista);
    }

    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<InventarioResponseDTO> getInventarioById(@PathVariable Integer id) {
        return inventarioService.getInventarioById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<InventarioResponseDTO> createInventario(@Valid @RequestBody InventarioRequestDTO inventarioDTO) {
        InventarioResponseDTO nuevo = inventarioService.createInventario(inventarioDTO);
        return ResponseEntity.ok(nuevo);
    }

    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<InventarioResponseDTO> updateInventario(@PathVariable Integer id, @Valid @RequestBody InventarioRequestDTO inventarioDTO) {
        try {
            InventarioResponseDTO actualizado = inventarioService.updateInventario(id, inventarioDTO);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventario(@PathVariable Integer id) {
        inventarioService.deleteInventario(id);
        return ResponseEntity.noContent().build();
    }
}

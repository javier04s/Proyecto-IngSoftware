package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.service.ProveedorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<ProveedorDTO> agregarProveedor(@RequestBody ProveedorCrearDTO proveedorCrearDTO) {
        return ResponseEntity.ok(proveedorService.createProveedor(proveedorCrearDTO));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> consultarProveedores() {
        return ResponseEntity.ok(proveedorService.getAllProveedores());
    }
}

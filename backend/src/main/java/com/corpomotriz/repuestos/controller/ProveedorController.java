package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<ProveedorDTO> agregarProveedor(@RequestBody ProveedorCrearDTO proveedorCrearDTO) {
        ProveedorDTO nuevoProveedor = proveedorService.createProveedor(proveedorCrearDTO);
        return ResponseEntity.ok(nuevoProveedor);
    }

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> consultarProveedor() {
        List<ProveedorDTO> listaProveedores = proveedorService.getAllProveedores();
        return ResponseEntity.ok(listaProveedores);
    }
}

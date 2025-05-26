package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.service.ProveedorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @PostMapping
    public ResponseEntity<ProveedorDTO> agregarProveedor(@Valid @RequestBody ProveedorCrearDTO proveedorCrearDTO) {
        ProveedorDTO nuevoProveedor = proveedorService.createProveedor(proveedorCrearDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProveedor);
    }

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> consultarProveedores() {
        List<ProveedorDTO> proveedores = proveedorService.getAllProveedores();
        return ResponseEntity.ok(proveedores);
    }
}

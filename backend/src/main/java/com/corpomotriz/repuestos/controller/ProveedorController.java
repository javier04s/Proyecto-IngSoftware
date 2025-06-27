package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.ProductoDTO;
import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.model.Producto;
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

    @GetMapping("/detalle/{id}/productos")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosPorProveedor(@PathVariable Long id) {
        List<ProductoDTO> productos = proveedorService.obtenerProductosDTOPorProveedor(Math.toIntExact(id));
        if (productos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(productos);
    }

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> consultarProveedores() {
        List<ProveedorDTO> proveedores = proveedorService.getAllProveedores();
        return ResponseEntity.ok(proveedores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorDTO> obtenerProveedorPorId(@PathVariable Long id) {
        return proveedorService.getProveedorById(Math.toIntExact(id))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> modificarProveedor(@PathVariable Integer id,
                                                           @Valid @RequestBody ProveedorCrearDTO dto) {
        ProveedorDTO actualizado = proveedorService.updateProveedor(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Integer id) {
        proveedorService.deleteProveedor(id);
        return ResponseEntity.noContent().build();
    }

}

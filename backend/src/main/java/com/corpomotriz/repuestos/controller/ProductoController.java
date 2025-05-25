package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.ProductoDTO;
import com.corpomotriz.repuestos.dto.crear.ProductoCrearDTO;
import com.corpomotriz.repuestos.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<ProductoDTO> insertarProducto(@RequestBody ProductoCrearDTO productoCrearDTO) {
        ProductoDTO nuevoProducto = productoService.createProducto(productoCrearDTO);
        return ResponseEntity.ok(nuevoProducto);
    }

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> consultarProductos() {
        List<ProductoDTO> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ProductoDTO>> consultarProductoPorId(@PathVariable Integer id) {
        Optional<ProductoDTO> producto = productoService.getProductoById(id);
        return ResponseEntity.ok(producto);
    }
}

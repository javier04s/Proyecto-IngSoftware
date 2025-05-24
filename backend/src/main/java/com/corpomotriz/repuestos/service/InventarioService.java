package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.request.InventarioRequestDTO;
import com.corpomotriz.repuestos.dto.response.InventarioResponseDTO;
import com.corpomotriz.repuestos.model.Inventario;
import com.corpomotriz.repuestos.model.Producto;
import com.corpomotriz.repuestos.repository.InventarioRepository;
import com.corpomotriz.repuestos.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<InventarioResponseDTO> getAllInventarios() {
        List<Inventario> inventarios = inventarioRepository.findAll();
        return inventarios.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<InventarioResponseDTO> getInventarioById(Integer id) {
        Optional<Inventario> inventario = inventarioRepository.findById(id);
        return inventario.map(this::mapToResponseDTO);
    }

    public InventarioResponseDTO createInventario(InventarioRequestDTO inventarioDTO) {
        Producto producto = productoRepository.findById(Math.toIntExact(inventarioDTO.getProductoId()))
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + inventarioDTO.getProductoId()));

        Inventario inventario = Inventario.builder()
                .producto(producto)
                .cantidadDisponible(inventarioDTO.getCantidadDisponible())
                .fechaActualizacion(LocalDateTime.now())
                .build();

        Inventario nuevoInventario = inventarioRepository.save(inventario);
        return mapToResponseDTO(nuevoInventario);
    }

    public InventarioResponseDTO updateInventario(Integer id, InventarioRequestDTO inventarioDTO) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventario no encontrado con id: " + id));

        Producto producto = productoRepository.findById(Math.toIntExact(inventarioDTO.getProductoId()))
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + inventarioDTO.getProductoId()));

        inventario.setProducto(producto);
        inventario.setCantidadDisponible(inventarioDTO.getCantidadDisponible());
        inventario.setFechaActualizacion(LocalDateTime.now());

        Inventario actualizado = inventarioRepository.save(inventario);
        return mapToResponseDTO(actualizado);
    }

    public void deleteInventario(Integer id) {
        inventarioRepository.deleteById(id);
    }

    private InventarioResponseDTO mapToResponseDTO(Inventario inventario) {
        InventarioResponseDTO dto = new InventarioResponseDTO();
        dto.setId(inventario.getId());
        dto.setProductoId(inventario.getProducto().getId());
        dto.setCantidadDisponible(inventario.getCantidadDisponible());
        dto.setFechaActualizacion(inventario.getFechaActualizacion());
        return dto;
    }
}

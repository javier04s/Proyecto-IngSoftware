package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.dto.crear.ProductoCrearDTO;
import com.corpomotriz.repuestos.dto.ProductoDTO;
import com.corpomotriz.repuestos.model.Producto;
import com.corpomotriz.repuestos.model.Proveedor;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.ProductoRepository;
import com.corpomotriz.repuestos.repository.ProveedorRepository;
import com.corpomotriz.repuestos.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoService implements iProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<ProductoDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::convertirAProductoDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductoDTO> getProductoById(Integer id) {
        return productoRepository.findByIdWithProveedor(id)
                .map(this::convertirAProductoDTO);
    }

    @Override
    @Transactional
    public ProductoDTO createProducto(ProductoCrearDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        Usuario creador = usuarioRepository.findById(dto.getCreadoPorId())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .cantidad(dto.getCantidad())
                .marca(dto.getMarca())
                .proveedor(proveedor)
                .creadoPor(creador)
                .fechaCreacion(LocalDateTime.now())
                .build();

        producto = productoRepository.save(producto);
        return convertirAProductoDTO(producto);
    }

    private ProductoDTO convertirAProductoDTO(Producto producto) {
        Proveedor proveedor = producto.getProveedor();
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .cantidad(producto.getCantidad())
                .marca(producto.getMarca())
                .fechaCreacion(producto.getFechaCreacion())
                .proveedor(proveedor != null ? ProveedorDTO.builder()
                        .id(proveedor.getId())
                        .nombre(proveedor.getNombre())
                        .telefono(proveedor.getTelefono())
                        .email(proveedor.getEmail())
                        .localizacion(proveedor.getLocalizacion())
                        .especializacion(proveedor.getEspecializacion())
                        .plazoEntrega(proveedor.getPlazoEntrega())
                        .fechaCreacion(proveedor.getFechaCreacion())
                        .build() : null)
                .build();
    }
}

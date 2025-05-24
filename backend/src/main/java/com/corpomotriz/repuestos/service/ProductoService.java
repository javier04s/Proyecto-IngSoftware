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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
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

    public List<ProductoDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::convertirAProductoDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductoDTO> getProductoById(Integer id) {
        return productoRepository.findByIdWithProveedor(id)
                .map(this::convertirAProductoDTO);
    }

    public ProductoDTO createProducto(ProductoCrearDTO dto) {
        Producto producto = new Producto();

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setCantidad(dto.getCantidad());
        producto.setMarca(dto.getMarca());

        // Buscar proveedor
        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        producto.setProveedor(proveedor);

        Usuario creador = usuarioRepository.findById(dto.getCreadoPorId())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        if (creador == null) {
            throw new RuntimeException("Usuario creador es nulo");
        }
        producto.setCreadoPor(creador);

        producto.setFechaCreacion(LocalDateTime.now());

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

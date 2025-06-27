package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.ProductoDTO;
import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.model.Producto;
import com.corpomotriz.repuestos.model.Proveedor;
import com.corpomotriz.repuestos.repository.ProductoRepository;
import com.corpomotriz.repuestos.repository.ProveedorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;

    public ProveedorService(ProveedorRepository proveedorRepository, ProductoRepository productoRepository) {
        this.proveedorRepository = proveedorRepository;
        this.productoRepository = productoRepository;
    }

    public List<ProveedorDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> obtenerProductosDTOPorProveedor(Integer proveedorId) {
        List<Producto> productos = obtenerProductosPorProveedor(proveedorId);
        return productos.stream().map(this::convertirADTO).toList();
    }

    public Optional<ProveedorDTO> getProveedorById(Integer id) {
        return proveedorRepository.findById(id)
                .map(this::toDTO);
    }

    public List<Producto> obtenerProductosPorProveedor(Integer proveedorId) {
        return productoRepository.findByProveedorId(proveedorId);
    }

    public ProveedorDTO createProveedor(ProveedorCrearDTO dto) {
        Proveedor proveedor = Proveedor.builder()
                .nombre(dto.getNombre())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .localizacion(dto.getLocalizacion())
                .especializacion(dto.getEspecializacion())
                .plazoEntrega(dto.getPlazoEntrega())
                .fechaCreacion(LocalDateTime.now())
                .build();

        return toDTO(proveedorRepository.save(proveedor));
    }

    @Transactional
    public ProveedorDTO updateProveedor(Integer id, ProveedorCrearDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        proveedor.setNombre(dto.getNombre());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setEmail(dto.getEmail());
        proveedor.setLocalizacion(dto.getLocalizacion());
        proveedor.setEspecializacion(dto.getEspecializacion());
        proveedor.setPlazoEntrega(dto.getPlazoEntrega());

        return toDTO(proveedorRepository.save(proveedor));
    }

    @Transactional
    public void deleteProveedor(Integer id) {
        if (!proveedorRepository.existsById(id)) {
            throw new RuntimeException("Proveedor no encontrado");
        }
        proveedorRepository.deleteById(id);
    }

    private ProveedorDTO toDTO(Proveedor proveedor) {
        return ProveedorDTO.builder()
                .id(proveedor.getId())
                .nombre(proveedor.getNombre())
                .telefono(proveedor.getTelefono())
                .email(proveedor.getEmail())
                .localizacion(proveedor.getLocalizacion())
                .especializacion(proveedor.getEspecializacion())
                .plazoEntrega(proveedor.getPlazoEntrega())
                .fechaCreacion(proveedor.getFechaCreacion())
                .build();
    }

    private ProductoDTO convertirADTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .cantidad(producto.getCantidad())
                .marca(producto.getMarca())
                .fechaCreacion(producto.getFechaCreacion())
                .proveedor(
                        ProveedorDTO.builder()
                                .id(producto.getProveedor().getId())
                                .nombre(producto.getProveedor().getNombre())
                                .telefono(producto.getProveedor().getTelefono())
                                .email(producto.getProveedor().getEmail())
                                .localizacion(producto.getProveedor().getLocalizacion())
                                .especializacion(producto.getProveedor().getEspecializacion())
                                .plazoEntrega(producto.getProveedor().getPlazoEntrega())
                                .fechaCreacion(producto.getProveedor().getFechaCreacion())
                                .build()
                )
                .build();
    }
}

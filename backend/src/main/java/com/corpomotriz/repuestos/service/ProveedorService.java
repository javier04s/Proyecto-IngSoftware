package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.model.Proveedor;
import com.corpomotriz.repuestos.repository.ProveedorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<ProveedorDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<ProveedorDTO> getProveedorById(Integer id) {
        return proveedorRepository.findById(id)
                .map(this::toDTO);
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
}

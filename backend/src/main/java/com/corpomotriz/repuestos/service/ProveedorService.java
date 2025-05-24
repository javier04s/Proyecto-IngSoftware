package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.crear.ProveedorCrearDTO;
import com.corpomotriz.repuestos.dto.ProveedorDTO;
import com.corpomotriz.repuestos.model.Proveedor;
import com.corpomotriz.repuestos.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<ProveedorDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::convertirAProveedorDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProveedorDTO> getProveedorById(Integer id) {
        return proveedorRepository.findById(id)
                .map(this::convertirAProveedorDTO);
    }

    public ProveedorDTO createProveedor(ProveedorCrearDTO dto) {
        Proveedor proveedor = Proveedor.builder()
                .nombre(dto.getNombre())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .localizacion(dto.getLocalizacion())
                .especializacion(dto.getEspecializacion())
                .plazoEntrega(dto.getPlazoEntrega())
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        Proveedor proveedorGuardado = proveedorRepository.save(proveedor);
        return convertirAProveedorDTO(proveedorGuardado);
    }

    private ProveedorDTO convertirAProveedorDTO(Proveedor proveedor) {
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

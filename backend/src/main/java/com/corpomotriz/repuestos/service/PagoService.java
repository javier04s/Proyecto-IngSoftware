package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.request.PagoRequestDTO;
import com.corpomotriz.repuestos.dto.response.PagoResponseDTO;
import com.corpomotriz.repuestos.model.Pago;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.PagoRepository;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public PagoResponseDTO registrarPago(PagoRequestDTO pagoDTO, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pago pago = Pago.builder()
                .monto(pagoDTO.getMonto())
                .metodo(pagoDTO.getMetodo())
                .estado(pagoDTO.getEstado())
                // Fecha de pago automática, ignorando la del DTO
                .fechaPago(LocalDate.now())
                .usuario(usuario)
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        Pago pagoGuardado = pagoRepository.save(pago);

        return mapToResponseDTO(pagoGuardado);
    }

    public PagoResponseDTO modificarPago(Integer id, PagoRequestDTO pagoDTO) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setMetodo(pagoDTO.getMetodo());
        pago.setMonto(pagoDTO.getMonto());
        pago.setEstado(pagoDTO.getEstado());

        Pago pagoActualizado = pagoRepository.save(pago);
        return mapToResponseDTO(pagoActualizado);
    }

    public List<PagoResponseDTO> obtenerTodosLosPagos() {
        return pagoRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<PagoResponseDTO> obtenerPagoPorId(Long id) {
        return pagoRepository.findById(Math.toIntExact(id))
                .map(this::mapToResponseDTO);
    }


    private PagoResponseDTO mapToResponseDTO(Pago pago) {
        PagoResponseDTO dto = new PagoResponseDTO();
        dto.setId(pago.getId());
        dto.setEmailUsuario(pago.getUsuario().getEmail());
        dto.setMonto(pago.getMonto());
        dto.setMetodo(pago.getMetodo());
        dto.setEstado(pago.getEstado());
        dto.setFechaPago(pago.getFechaPago());
        return dto;
    }
}

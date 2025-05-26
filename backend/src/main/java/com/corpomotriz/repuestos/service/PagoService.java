package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.request.PagoRequestDTO;
import com.corpomotriz.repuestos.dto.response.PagoResponseDTO;
import com.corpomotriz.repuestos.model.Pago;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.PagoRepository;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;

    public PagoResponseDTO registrarPago(PagoRequestDTO pagoDTO) {
        Usuario usuario = usuarioRepository.findByEmail(pagoDTO.getEmailUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario con email '" + pagoDTO.getEmailUsuario() + "' no encontrado."));

        Pago pago = Pago.builder()
                .monto(pagoDTO.getMonto())
                .metodo(pagoDTO.getMetodo())
                .estado(pagoDTO.getEstado())
                .fechaPago(LocalDate.now())
                .usuario(usuario)
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

        // Si quieres actualizar el usuario también, deberías buscarlo aquí.
        if (pagoDTO.getEmailUsuario() != null && !pagoDTO.getEmailUsuario().isBlank()) {
            Usuario usuario = usuarioRepository.findByEmail(pagoDTO.getEmailUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario con email '" + pagoDTO.getEmailUsuario() + "' no encontrado."));
            pago.setUsuario(usuario);
        }

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
        return PagoResponseDTO.builder()
                .id(pago.getId())
                .emailUsuario(pago.getUsuario().getEmail())
                .monto(pago.getMonto())
                .metodo(pago.getMetodo())
                .estado(pago.getEstado())
                .fechaPago(pago.getFechaPago())
                .build();
    }
}

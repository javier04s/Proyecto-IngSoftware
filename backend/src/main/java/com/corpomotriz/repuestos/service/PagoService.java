package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.PagoProductoDTO;
import com.corpomotriz.repuestos.dto.request.PagoRequestDTO;
import com.corpomotriz.repuestos.dto.response.PagoResponseDTO;
import com.corpomotriz.repuestos.model.Pago;
import com.corpomotriz.repuestos.model.PagoProducto;
import com.corpomotriz.repuestos.model.Producto;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.PagoProductoRepository;
import com.corpomotriz.repuestos.repository.PagoRepository;
import com.corpomotriz.repuestos.repository.ProductoRepository;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PagoProductoRepository pagoProductoRepository;

    @Transactional
    public PagoResponseDTO registrarPago(PagoRequestDTO pagoDTO) {
        Usuario usuario = usuarioRepository.findByEmail(pagoDTO.getEmailUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario con email '" + pagoDTO.getEmailUsuario() + "' no encontrado."));

        Pago pago = Pago.builder()
                .monto(pagoDTO.getMonto())
                .metodo(pagoDTO.getMetodo())
                .estado(pagoDTO.getEstado())
                .fechaPago(LocalDateTime.now())
                .usuario(usuario)
                .numeroTarjeta(pagoDTO.getNumeroTarjeta())
                .fechaExpiracionTarjeta(pagoDTO.getFechaExpiracion())
                .cvvTarjeta(pagoDTO.getCvv())
                .nombreTitularTarjeta(pagoDTO.getNombreTitular())
                .build();

        Pago pagoGuardado = pagoRepository.save(pago);

        for (PagoProductoDTO productoDTO : pagoDTO.getProductos()) {
            Producto producto = productoRepository.findById(productoDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto con ID " + productoDTO.getProductoId() + " no encontrado"));

            if (producto.getCantidad() < productoDTO.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para producto ID " + producto.getId());
            }

            PagoProducto pagoProducto = PagoProducto.builder()
                    .pago(pagoGuardado)
                    .producto(producto)
                    .cantidad(productoDTO.getCantidad())
                    .build();
            pagoProductoRepository.save(pagoProducto);

            producto.setCantidad(producto.getCantidad() - productoDTO.getCantidad());
            productoRepository.save(producto);
        }

        return mapToResponseDTO(pagoGuardado);
    }

    @Transactional
    public PagoResponseDTO modificarPago(Integer id, PagoRequestDTO pagoDTO) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setMetodo(pagoDTO.getMetodo());
        pago.setMonto(pagoDTO.getMonto());
        pago.setEstado(pagoDTO.getEstado());

        if ("TARJETA".equalsIgnoreCase(pagoDTO.getMetodo())) {
            pago.setNumeroTarjeta(pagoDTO.getNumeroTarjeta());
            pago.setFechaExpiracionTarjeta(pagoDTO.getFechaExpiracion());
            pago.setCvvTarjeta(pagoDTO.getCvv());
            pago.setNombreTitularTarjeta(pagoDTO.getNombreTitular());
        } else {
            pago.setNumeroTarjeta(null);
            pago.setFechaExpiracionTarjeta(null);
            pago.setCvvTarjeta(null);
            pago.setNombreTitularTarjeta(null);
        }

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

    @Transactional
    public boolean eliminarPago(Integer id) {
        Optional<Pago> pagoOpt = pagoRepository.findById(id);
        if (pagoOpt.isEmpty()) {
            return false;
        }

        Pago pago = pagoOpt.get();

        pagoProductoRepository.deleteAll(pago.getPagoProductos());

        pagoRepository.delete(pago);

        return true;
    }


    private PagoResponseDTO mapToResponseDTO(Pago pago) {
        List<PagoProductoDTO> productos = pago.getPagoProductos() == null ?
                List.of() :
                pago.getPagoProductos().stream()
                        .map(pp -> PagoProductoDTO.builder()
                                .productoId(Math.toIntExact(pp.getProducto().getId()))
                                .nombreProducto(pp.getProducto().getNombre())
                                .cantidad(pp.getCantidad())
                                .build())
                        .collect(Collectors.toList());

        return PagoResponseDTO.builder()
                .id(pago.getId())
                .emailUsuario(pago.getUsuario().getEmail())
                .monto(pago.getMonto())
                .metodo(pago.getMetodo())
                .estado(pago.getEstado())
                .fechaPago(pago.getFechaPago())
                .productos(productos)
                .numeroTarjeta(pago.getNumeroTarjeta())
                .fechaExpiracion(pago.getFechaExpiracionTarjeta())
                .cvv(pago.getCvvTarjeta())
                .nombreTitular(pago.getNombreTitularTarjeta())
                .build();
    }
}
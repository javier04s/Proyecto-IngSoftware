package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.request.PagoRequestDTO;
import com.corpomotriz.repuestos.dto.response.PagoResponseDTO;
import com.corpomotriz.repuestos.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<PagoResponseDTO> registrarPago(@Valid @RequestBody PagoRequestDTO pagoDTO) {
        PagoResponseDTO nuevoPago = pagoService.registrarPago(pagoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPago);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PagoResponseDTO> modificarPago(@PathVariable Integer id, @Valid @RequestBody PagoRequestDTO pagoDTO) {
        PagoResponseDTO pagoModificado = pagoService.modificarPago(id, pagoDTO);
        return ResponseEntity.ok(pagoModificado);
    }

    @GetMapping
    public ResponseEntity<List<PagoResponseDTO>> consultarPagos() {
        List<PagoResponseDTO> pagos = pagoService.obtenerTodosLosPagos();
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoResponseDTO> consultarPagoPorId(@PathVariable Long id) {
        Optional<PagoResponseDTO> pago = pagoService.obtenerPagoPorId(id);
        return pago.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

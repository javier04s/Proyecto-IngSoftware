package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.request.PagoRequestDTO;
import com.corpomotriz.repuestos.dto.response.PagoResponseDTO;
import com.corpomotriz.repuestos.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<PagoResponseDTO> registrarPago(@Valid @RequestBody PagoRequestDTO pagoDTO, Principal principal) {
        PagoResponseDTO nuevoPago = pagoService.registrarPago(pagoDTO, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPago);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<PagoResponseDTO> modificarPago(@PathVariable Integer id, @Valid @RequestBody PagoRequestDTO pagoDTO) {
        PagoResponseDTO pagoModificado = pagoService.modificarPago(id, pagoDTO);
        return ResponseEntity.ok(pagoModificado);
    }
}

package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.PedidoCrearDTO;
import com.corpomotriz.repuestos.dto.PedidoDTO;
import com.corpomotriz.repuestos.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Crear pedido (CLIENTE)
    @PreAuthorize("hasAuthority('CLIENTE')")
    @PostMapping
    public ResponseEntity<PedidoDTO> crearPedido(@RequestBody PedidoCrearDTO pedidoCrearDTO, Principal principal) {
        PedidoDTO nuevoPedido = pedidoService.createPedido(pedidoCrearDTO, principal.getName());
        return ResponseEntity.ok(nuevoPedido);
    }

    // Consultar pedidos del usuario autenticado (CLIENTE y ADMINISTRADOR)
    @PreAuthorize("hasAnyAuthority('CLIENTE', 'ADMINISTRADOR')")
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoDTO>> getPedidosUsuario(Principal principal) {
        List<PedidoDTO> pedidos = pedidoService.getPedidosPorUsuario(principal.getName());
        return ResponseEntity.ok(pedidos);
    }

    // Consultar pedido por ID (ADMINISTRADOR)
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> getPedidoById(@PathVariable Integer id) {
        return pedidoService.getPedidoById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Actualizar pedido (ADMINISTRADOR)
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> updatePedido(@PathVariable Integer id, @RequestBody PedidoCrearDTO pedidoCrearDTO) {
        try {
            PedidoDTO actualizado = pedidoService.updatePedido(id, pedidoCrearDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar pedido (ADMINISTRADOR)
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }
}

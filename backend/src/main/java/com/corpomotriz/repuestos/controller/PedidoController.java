package com.corpomotriz.repuestos.controller;

import com.corpomotriz.repuestos.dto.crear.PedidoCrearDTO;
import com.corpomotriz.repuestos.dto.PedidoDTO;
import com.corpomotriz.repuestos.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoDTO> crearPedido(@RequestBody PedidoCrearDTO pedidoCrearDTO) {
        PedidoDTO nuevoPedido = pedidoService.createPedido(pedidoCrearDTO, null);
        return ResponseEntity.ok(nuevoPedido);
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoDTO>> getPedidosUsuario() {
        List<PedidoDTO> pedidos = pedidoService.getPedidosPorUsuario(null);
        return ResponseEntity.ok(pedidos);
    }

    // Consultar pedido por ID (antes ADMINISTRADOR)
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> getPedidoById(@PathVariable Integer id) {
        return pedidoService.getPedidoById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Actualizar pedido (antes ADMINISTRADOR)
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> updatePedido(@PathVariable Integer id, @RequestBody PedidoCrearDTO pedidoCrearDTO) {
        try {
            PedidoDTO actualizado = pedidoService.updatePedido(id, pedidoCrearDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar pedido (antes ADMINISTRADOR)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }
}

package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.crear.PedidoCrearDTO;
import com.corpomotriz.repuestos.dto.PedidoDTO;
import com.corpomotriz.repuestos.model.Pedido;
import com.corpomotriz.repuestos.model.Producto;
import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.PedidoRepository;
import com.corpomotriz.repuestos.repository.ProductoRepository;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<PedidoDTO> getAllPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::convertirAPedidoDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoDTO> getPedidosPorUsuario(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();
        return pedidoRepository.findAll()
                .stream()
                .filter(p -> p.getUsuario().equals(usuario))
                .map(this::convertirAPedidoDTO)
                .collect(Collectors.toList());
    }

    public Optional<PedidoDTO> getPedidoById(Integer id) {
        return pedidoRepository.findById(id)
                .map(this::convertirAPedidoDTO);
    }

    public PedidoDTO createPedido(PedidoCrearDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .producto(producto)
                .cantidad(dto.getCantidad())
                .fecha(LocalDateTime.now())
                .build();

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        return convertirAPedidoDTO(pedidoGuardado);
    }

    public PedidoDTO updatePedido(Integer id, PedidoCrearDTO dto) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        pedido.setProducto(producto);
        pedido.setCantidad(dto.getCantidad());

        Pedido actualizado = pedidoRepository.save(pedido);
        return convertirAPedidoDTO(actualizado);
    }

    public void deletePedido(Integer id) {
        pedidoRepository.deleteById(id);
    }

    private PedidoDTO convertirAPedidoDTO(Pedido pedido) {
        return PedidoDTO.builder()
                .id(pedido.getId())
                .usuarioId(Math.toIntExact(pedido.getUsuario() != null ? pedido.getUsuario().getId() : null))
                .productoId(Math.toIntExact(pedido.getProducto() != null ? pedido.getProducto().getId() : null))
                .cantidad(pedido.getCantidad())
                .fecha(pedido.getFecha())
                .build();
    }
}

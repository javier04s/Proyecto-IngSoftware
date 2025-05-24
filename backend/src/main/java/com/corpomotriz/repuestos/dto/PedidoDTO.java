package com.corpomotriz.repuestos.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {
    private Integer id;
    private Integer usuarioId;
    private Integer productoId;
    private Integer cantidad;
    private LocalDateTime fecha;
}


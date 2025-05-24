package com.corpomotriz.repuestos.dto.crear;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoCrearDTO {
    private Integer productoId;
    private Integer cantidad;
}

package com.corpomotriz.repuestos.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PagoProductoDTO {
    private Integer productoId;
    private String nombreProducto;
    private Integer cantidad;
}

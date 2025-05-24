package com.corpomotriz.repuestos.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer cantidad;
    private String marca;
    private LocalDateTime fechaCreacion;

    private ProveedorDTO proveedor;
}

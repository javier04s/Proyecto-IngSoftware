package com.corpomotriz.repuestos.dto.crear;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoCrearDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer cantidad;
    private Integer proveedorId;
    private Integer creadoPorId;
    private String marca;
}
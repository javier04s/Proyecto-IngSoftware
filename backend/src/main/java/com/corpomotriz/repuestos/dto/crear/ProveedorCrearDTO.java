package com.corpomotriz.repuestos.dto.crear;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProveedorCrearDTO {
    private String nombre;
    private String telefono;
    private String email;
    private String localizacion;
    private String especializacion;
    private String plazoEntrega;
}
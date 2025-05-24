package com.corpomotriz.repuestos.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProveedorDTO {
    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private String localizacion;
    private String especializacion;
    private String plazoEntrega;
    private LocalDateTime fechaCreacion;
}

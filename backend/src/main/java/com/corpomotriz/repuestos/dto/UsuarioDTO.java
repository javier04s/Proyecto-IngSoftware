package com.corpomotriz.repuestos.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Integer id;
    private String nombre;
    private String email;
    private String rol;
    private LocalDateTime fechaCreacion;
}

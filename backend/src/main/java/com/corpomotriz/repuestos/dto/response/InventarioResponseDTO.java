package com.corpomotriz.repuestos.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InventarioResponseDTO {

    private Long id;
    private Long productoId;
    private Integer cantidadDisponible;
    private LocalDateTime fechaActualizacion;
}

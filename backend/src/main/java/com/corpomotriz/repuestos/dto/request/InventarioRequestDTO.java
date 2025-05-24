package com.corpomotriz.repuestos.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventarioRequestDTO {

    @NotNull(message = "El id del producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad disponible es obligatoria")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a cero")
    private Integer cantidadDisponible;
}

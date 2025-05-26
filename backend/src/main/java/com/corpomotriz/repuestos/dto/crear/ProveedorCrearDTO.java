package com.corpomotriz.repuestos.dto.crear;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProveedorCrearDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{7,15}$", message = "Teléfono inválido")
    private String telefono;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "La localización es obligatoria")
    private String localizacion;

    @NotBlank(message = "La especialización es obligatoria")
    private String especializacion;

    @NotBlank(message = "El plazo de entrega es obligatorio")
    private String plazoEntrega;
}

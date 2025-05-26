package com.corpomotriz.repuestos.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@ToString
public class PagoRequestDTO {

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser positivo")
    private BigDecimal monto;

    @NotBlank(message = "El método es obligatorio")
    private String metodo;

    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    @NotBlank(message = "El email del usuario es obligatorio")
    @Email(message = "Formato de email inválido")
    private String emailUsuario;

}


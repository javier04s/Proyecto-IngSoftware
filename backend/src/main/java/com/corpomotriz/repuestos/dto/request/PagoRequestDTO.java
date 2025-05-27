package com.corpomotriz.repuestos.dto.request;

import com.corpomotriz.repuestos.dto.PagoProductoDTO;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    private LocalDateTime fechaPago;

    @NotBlank(message = "El email del usuario es obligatorio")
    @Email(message = "Formato de email inválido")
    private String emailUsuario;

    private List<PagoProductoDTO> productos;

}


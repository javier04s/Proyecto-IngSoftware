package com.corpomotriz.repuestos.dto.request;

import com.corpomotriz.repuestos.dto.PagoProductoDTO;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class PagoRequestDTO {

    @NotBlank(message = "El email del usuario es obligatorio.")
    @Email(message = "El email debe ser una dirección de correo válida.")
    private String emailUsuario;

    @NotNull(message = "El monto es obligatorio.")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero.")
    private BigDecimal monto;

    @NotBlank(message = "El método de pago es obligatorio.")
    private String metodo;

    @NotBlank(message = "El estado del pago es obligatorio.")
    private String estado;

    @NotEmpty(message = "Debe haber al menos un producto en el pago.")
    private List<PagoProductoDTO> productos;

    @Pattern(regexp = "^[0-9]{13,19}$", message = "Número de tarjeta inválido. Debe contener entre 13 y 19 dígitos.")
    private String numeroTarjeta;

    @Pattern(regexp = "^(0[1-9]|1[0-2])\\/[0-9]{2}$", message = "Fecha de expiración inválida (MM/AA).")
    private String fechaExpiracion; // MM/AA

    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV inválido. Debe contener 3 o 4 dígitos.")
    private String cvv;

    @Size(min = 2, max = 255, message = "El nombre del titular debe tener entre 2 y 255 caracteres.")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "El nombre del titular solo debe contener letras y espacios.")
    private String nombreTitular;
}
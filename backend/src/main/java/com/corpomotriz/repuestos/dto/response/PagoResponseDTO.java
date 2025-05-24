package com.corpomotriz.repuestos.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PagoResponseDTO {

    private Integer id;
    private String emailUsuario;
    private BigDecimal monto;
    private String metodo;
    private String estado;
    private LocalDate fechaPago;
}

package com.corpomotriz.repuestos.dto.response;

import com.corpomotriz.repuestos.dto.PagoProductoDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class PagoResponseDTO {

    private Integer id;
    private String emailUsuario;
    private BigDecimal monto;
    private String metodo;
    private String estado;
    private LocalDateTime fechaPago;

    private List<PagoProductoDTO> productos;
}

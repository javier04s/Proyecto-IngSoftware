package com.corpomotriz.repuestos.dto.response;

import com.corpomotriz.repuestos.dto.UsuarioDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {
    private String message;
    private UsuarioDTO usuario;
}

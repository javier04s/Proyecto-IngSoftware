package com.corpomotriz.repuestos.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proveedor", schema = "repuestos_db")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Proveedor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private String localizacion;
    private String especializacion;
    private String plazoEntrega;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

}


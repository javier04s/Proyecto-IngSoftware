package com.corpomotriz.repuestos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pago", schema = "repuestos_db")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(length = 100) // Cambiado a 100 para un método más descriptivo si es necesario
    private String metodo;

    @Column(length = 20) // Ajustado a un tamaño más adecuado para estados
    private String estado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "pago", cascade = CascadeType.ALL, orphanRemoval = true) // Added orphanRemoval
    private List<PagoProducto> pagoProductos = new ArrayList<>();

    // --- Nuevos campos para la tarjeta de crédito ---
    @Column(name = "numero_tarjeta", length = 20, nullable = true) // Ejemplo: para últimos 4 dígitos o token
    private String numeroTarjeta;

    @Column(name = "fecha_expiracion_tarjeta", length = 5, nullable = true) // Formato MM/AA
    private String fechaExpiracionTarjeta;

    @Column(name = "cvv_tarjeta", length = 4, nullable = true) // CVV
    private String cvvTarjeta;

    @Column(name = "nombre_titular_tarjeta", length = 255, nullable = true)
    private String nombreTitularTarjeta;
    // --- Fin Nuevos campos ---

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
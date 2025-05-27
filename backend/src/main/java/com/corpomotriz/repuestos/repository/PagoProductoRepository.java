package com.corpomotriz.repuestos.repository;

import com.corpomotriz.repuestos.model.PagoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoProductoRepository extends JpaRepository<PagoProducto, Long> {
}

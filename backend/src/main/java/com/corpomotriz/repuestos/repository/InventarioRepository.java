package com.corpomotriz.repuestos.repository;

import com.corpomotriz.repuestos.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
}
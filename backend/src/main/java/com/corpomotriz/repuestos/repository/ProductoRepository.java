package com.corpomotriz.repuestos.repository;

import com.corpomotriz.repuestos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    @Query("SELECT p FROM Producto p LEFT JOIN FETCH p.proveedor WHERE p.id = :id")
    Optional<Producto> findByIdWithProveedor(@Param("id") Integer id);
}

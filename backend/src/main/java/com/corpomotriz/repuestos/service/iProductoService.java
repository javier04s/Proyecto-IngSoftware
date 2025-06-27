package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.dto.ProductoDTO;
import com.corpomotriz.repuestos.dto.crear.ProductoCrearDTO;

import java.util.List;
import java.util.Optional;

public interface iProductoService {
    List<ProductoDTO> getAllProductos();
    Optional<ProductoDTO> getProductoById(Integer id);
    ProductoDTO createProducto(ProductoCrearDTO dto);
    boolean deleteProducto(Integer id);
    Optional<ProductoDTO> updateProducto(Integer id, ProductoCrearDTO dto);
}

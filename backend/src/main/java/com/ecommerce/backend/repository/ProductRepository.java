package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.active = true OR p.active IS NULL")
    List<Product> findAllVisible();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true OR p.active IS NULL")
    long countAllVisible();
}
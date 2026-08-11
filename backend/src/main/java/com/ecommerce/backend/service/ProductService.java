package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getActiveProducts() {
        return productRepository.findAllVisible();
    }

    public long getActiveProductCount() {
        return productRepository.countAllVisible();
    }

    public Product createProduct(Product product) {
        product.setActive(true);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found: " + id)
                );

        product.setActive(false);
        productRepository.save(product);
    }
}

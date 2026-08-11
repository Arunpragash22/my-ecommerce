package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderItemRequest;
import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
   
    private final PabblyWebhookService pabblyWebhookService;

    @Transactional
    public Order createOrder(OrderRequest request) {

        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .totalAmount(request.getTotalAmount())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found: " +
                                    itemRequest.getProductId()
                            )
                    );

            int quantity = itemRequest.getQuantity();

            // Check stock
            if (product.getStock() < quantity) {
                throw new RuntimeException(
                        "Insufficient stock for product: " +
                        product.getName()
                );
            }

            // Reduce stock
            product.setStock(product.getStock() - quantity);

            productRepository.save(product);

            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        pabblyWebhookService.sendOrderNotification(savedOrder);

        return savedOrder;
    }
}
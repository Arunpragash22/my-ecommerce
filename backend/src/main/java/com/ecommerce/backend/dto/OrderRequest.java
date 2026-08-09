package com.ecommerce.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class OrderRequest {

    private String customerName;

    private String phoneNumber;

    private String address;

    private BigDecimal totalAmount;

    private List<OrderItemRequest> items;
}
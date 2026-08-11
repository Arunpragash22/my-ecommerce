package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class PabblyWebhookService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String WEBHOOK_URL =
            "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjMwNTZjMDYzMTA0MzE1MjZjNTUzYyI_3D_pc/IjU3NjcwNTY4MDYzNjA0MzA1MjY4NTUzNDUxMzQi_pc";

    public void sendOrderNotification(Order order) {

        try {

            String products = order.getItems()
                    .stream()
                    .map(this::formatItem)
                    .collect(Collectors.joining("\n"));

            Map<String, Object> data = new HashMap<>();

            data.put("customerName", order.getCustomerName());
            data.put("phoneNumber", order.getPhoneNumber());
            data.put("orderId", order.getId());
            data.put("products", products);
            data.put("totalAmount", order.getTotalAmount());
            data.put("address", order.getAddress());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(data, headers);

            restTemplate.postForEntity(
                    WEBHOOK_URL,
                    request,
                    String.class
            );

            System.out.println("Pabbly webhook sent successfully.");

        } catch (Exception e) {

            System.err.println(
                    "Pabbly webhook failed: " +
                    e.getMessage()
            );
        }
    }

    private String formatItem(OrderItem item) {

    BigDecimal subtotal = item.getPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));

    return item.getProduct().getName()
            + " x "
            + item.getQuantity()
            + " - Rs."
            + subtotal;
}
}
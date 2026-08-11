package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${WHATSAPP_ACCESS_TOKEN}")
    private String accessToken;

    @Value("${WHATSAPP_PHONE_NUMBER_ID}")
    private String phoneNumberId;

    public void sendOrderConfirmation(Order order) {

        String recipient = normalizePhoneNumber(order.getPhoneNumber());

        StringBuilder message = new StringBuilder();

        message.append("🛍️ *MyEcommerce - Order Confirmed*\n\n");

        message.append("Order ID: #")
                .append(order.getId())
                .append("\n\n");

        message.append("Customer: ")
                .append(order.getCustomerName())
                .append("\n\n");

        message.append("📦 *Order Details*\n\n");

        for (OrderItem item : order.getItems()) {

            message.append("Product: ")
                    .append(item.getProduct().getName())
                    .append("\n");

            message.append("Quantity: ")
                    .append(item.getQuantity())
                    .append("\n");

            message.append("Price: ₹")
                    .append(item.getPrice())
                    .append("\n\n");
        }

        message.append("💰 Total Amount: ₹")
                .append(order.getTotalAmount())
                .append("\n\n");

        message.append("📍 Address:\n")
                .append(order.getAddress())
                .append("\n\n");

        message.append("Thank you for shopping with MyEcommerce! ❤️");

        sendWhatsAppMessage(
                recipient,
                message.toString()
        );
    }

    private void sendWhatsAppMessage(
            String recipient,
            String message
    ) {

        String url =
                "https://graph.facebook.com/v25.0/"
                + phoneNumberId
                + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> text = new HashMap<>();
        text.put("body", message);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messaging_product", "whatsapp");
        requestBody.put("to", recipient);
        requestBody.put("type", "text");
        requestBody.put("text", text);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate =
                new RestTemplate();

        System.out.println("Sending WhatsApp message to: " + recipient);
        System.out.println("WhatsApp URL: " + url);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        String.class
                );

        System.out.println(
                "Order WhatsApp response: "
                + response.getBody()
        );
    }

    private String normalizePhoneNumber(String phone) {

        phone = phone.replaceAll("[^0-9]", "");

        if (phone.startsWith("0")) {
            phone = "94" + phone.substring(1);
        }

        return phone;
    }
}
package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppService {

    @Value("${WHATSAPP_ACCESS_TOKEN}")
    private String accessToken;

    @Value("${WHATSAPP_PHONE_NUMBER_ID}")
    private String phoneNumberId;

    public void sendOrderConfirmation(Order order) {

        String recipient = normalizePhoneNumber(order.getPhoneNumber());

        String message = """
                🛍️ MyEcommerce - Order Confirmed

                Order ID: #%d

                Customer: %s

                Total Amount: ₹%s

                Address:
                %s

                Thank you for shopping with MyEcommerce!
                """.formatted(
                order.getId(),
                order.getCustomerName(),
                order.getTotalAmount(),
                order.getAddress()
        );

        sendWhatsAppMessage(recipient, message);
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

        String requestBody =
                """
                {
                  "messaging_product": "whatsapp",
                  "to": "%s",
                  "type": "text",
                  "text": {
                    "body": "%s"
                  }
                }
                """.formatted(
                        recipient,
                        message.replace("\"", "\\\"")
                );

        HttpEntity<String> request =
                new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate =
                new RestTemplate();

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

        if (phone.startsWith("+")) {
            phone = phone.substring(1);
        }

        return phone;
    }
}
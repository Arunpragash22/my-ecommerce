package com.ecommerce.backend.controller;

import tools.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppWebhookController {

    private static final String VERIFY_TOKEN = "myecommerce_webhook_2026";

    @Value("${WHATSAPP_ACCESS_TOKEN}")
    private String accessToken;

    @Value("${WHATSAPP_PHONE_NUMBER_ID}")
    private String phoneNumberId;

    @GetMapping("/webhook")
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge
    ) {

        if ("subscribe".equals(mode) && VERIFY_TOKEN.equals(token)) {
            return ResponseEntity.ok(challenge);
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Forbidden");
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> receiveWebhook(
            @RequestBody JsonNode body
    ) {

        System.out.println("WhatsApp Webhook:");
        System.out.println(body);

        try {

            JsonNode messages =
                    body.path("entry")
                        .path(0)
                        .path("changes")
                        .path(0)
                        .path("value")
                        .path("messages");

            if (!messages.isArray() || messages.isEmpty()) {
                return ResponseEntity.ok("EVENT_RECEIVED");
            }

            JsonNode message = messages.get(0);

            String from = message.path("from").asText();
            String messageType = message.path("type").asText();

            if (!"text".equals(messageType)) {
                return ResponseEntity.ok("EVENT_RECEIVED");
            }

            String incomingMessage =
                    message.path("text")
                           .path("body")
                           .asText();

            System.out.println("From: " + from);
            System.out.println("Message: " + incomingMessage);

            sendWhatsAppMessage(
                    from,
                    "Hello! Thanks for contacting MyEcommerce. How can I help you?"
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("EVENT_RECEIVED");
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
                """.formatted(recipient, message);

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
                "WhatsApp API response: "
                + response.getBody()
        );
    }
}
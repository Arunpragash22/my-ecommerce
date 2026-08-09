package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createDefaultAdmin() {
        return args -> {

            String adminEmail = "admin@company.com";

            if (!userRepository.findByEmail(adminEmail).isPresent()) {

                User admin = User.builder()
                        .name("Admin")
                        .email(adminEmail)
                        .phone("0000000000")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role("ADMIN")
                        .build();

                userRepository.save(admin);

                System.out.println("Default admin created!");
            }
        };
    }
}
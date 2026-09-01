package com.phishshield;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PhishShieldApplication {
    public static void main(String[] args) {
        SpringApplication.run(PhishShieldApplication.class, args);
    }
}

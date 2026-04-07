package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.smartcampus", "com.campus"})
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
        System.out.println("========================================");
        System.out.println("🚀 Smart Campus API is Running!");
        System.out.println("📍 http://localhost:8080");
        System.out.println("========================================");
    }
}
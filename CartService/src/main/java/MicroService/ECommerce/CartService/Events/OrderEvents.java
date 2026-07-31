package MicroService.ECommerce.CartService.Events;

import java.math.BigDecimal;

import java.time.LocalDateTime;

import java.util.List;

import MicroService.ECommerce.CartService.Dto.Product;


public record OrderEvents(
        Long orderId,
        Long userId,
        String email , 
        EventType eventType,
        String status,
        LocalDateTime eventTime,
        BigDecimal totalAmount ,
        List<Product>products
) {}


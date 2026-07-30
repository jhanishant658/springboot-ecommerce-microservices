package MicroService.ECommerce.OrderService.Events;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import MicroService.ECommerce.OrderService.Request.Product;


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


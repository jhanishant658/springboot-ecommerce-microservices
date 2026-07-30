package MicroService.ECommerce.OrderService.Events;

import java.math.BigDecimal;
import java.time.LocalDateTime;


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


package MicroService.ECommerce.OrderService.Events;

import java.time.LocalDateTime;





public record OrderEvents(
        Long orderId,
        Long userId,
        String email , 
        EventType eventType,
        String status,
        LocalDateTime eventTime
) {}


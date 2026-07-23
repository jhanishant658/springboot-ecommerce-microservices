package MicroService.ECommerce.OrderService.Events;

import java.time.LocalDateTime;





public record OrderEvents(
        Long orderId,
        Long userId,
        EventType eventType,
        String status,
        LocalDateTime eventTime
) {}


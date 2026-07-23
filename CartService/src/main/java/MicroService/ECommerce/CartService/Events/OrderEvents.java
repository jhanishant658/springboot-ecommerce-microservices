package MicroService.ECommerce.CartService.Events;

import java.time.LocalDateTime;





public record OrderEvents(
        Long orderId,
        Long userId,
        EventType eventType,
        String status,
        LocalDateTime eventTime
) {}


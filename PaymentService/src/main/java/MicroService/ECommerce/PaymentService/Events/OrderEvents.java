package MicroService.ECommerce.PaymentService.Events;

import java.math.BigDecimal;
import java.time.LocalDateTime;





public record OrderEvents(
        Long orderId,
        Long userId,
        EventType eventType,
        String status,
        LocalDateTime eventTime ,
        BigDecimal totalAmount 
) {}
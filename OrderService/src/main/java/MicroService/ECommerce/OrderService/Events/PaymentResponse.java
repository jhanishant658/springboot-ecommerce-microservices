package MicroService.ECommerce.OrderService.Events;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
    Long id, Long orderId,
    Long userId , BigDecimal amount, 
    PaymentStatus status, String message,
     Instant createdAt) {

     } 

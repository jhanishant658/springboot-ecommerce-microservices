package MicroService.ECommerce.OrderService.Events;

import java.math.BigDecimal;


 public record PaymentEvent(
    Long orderId,
    Long userId,
    String email,
    BigDecimal amount,
    PaymentStatus status
) {} 

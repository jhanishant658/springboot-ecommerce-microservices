package MicroService.ECommerce.PaymentService.Events;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;






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
record Product(Long id, Long quantity) {
}

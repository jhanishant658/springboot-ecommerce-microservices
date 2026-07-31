package MicroService.ECommerce.InventoryService.Events;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import MicroService.ECommerce.InventoryService.Dtos.InventoryDtos.Product;
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
package MicroService.ECommerce.NotificationService.Events;

import java.time.LocalDateTime;

/**
 * Mirrors MicroService.ECommerce.OrderService.Events.OrderEvents field-for-field.
 * OrderService publishes this to the "order-placed" topic; we consume it here
 * to trigger the order-status email. Since useTypeHeaders(false) is set on the
 * consumer, Jackson maps by field name/order rather than by class identity, so
 * this local copy just needs to match the producer's shape.
 */
public record OrderEvents(
        Long orderId,
        Long userId,
        EventType eventType,
        String status,
        LocalDateTime eventTime
) {}

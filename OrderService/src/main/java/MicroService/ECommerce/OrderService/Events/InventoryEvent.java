package MicroService.ECommerce.OrderService.Events;
public record InventoryEvent(long orderId, Status status ,String email) {
}


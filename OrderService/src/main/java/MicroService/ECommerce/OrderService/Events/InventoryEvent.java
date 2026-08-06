package MicroService.ECommerce.OrderService.Events;
public record InventoryEvent(long id ,long orderId, Status status ,String email) {
}


package MicroService.ECommerce.InventoryService.Events;

/**
 * InventoryEvent
 */
public record InventoryEvent(long orderId , Status status,String email) {
}

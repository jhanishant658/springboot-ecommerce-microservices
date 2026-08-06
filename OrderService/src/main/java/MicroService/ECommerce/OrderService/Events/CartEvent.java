package MicroService.ECommerce.OrderService.Events;

import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;

public record CartEvent(
        Long orderId,String email,
        PlaceOrderRequest placeOrderReq 
) {}


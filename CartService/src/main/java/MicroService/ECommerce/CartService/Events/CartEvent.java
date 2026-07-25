package MicroService.ECommerce.CartService.Events;


import MicroService.ECommerce.CartService.ClientRequest.PlaceOrderRequest;





public record CartEvent(
        Long orderId,
        PlaceOrderRequest placeOrderReq 
) {}

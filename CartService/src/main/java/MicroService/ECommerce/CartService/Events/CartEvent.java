package MicroService.ECommerce.CartService.Events;


import MicroService.ECommerce.CartService.ClientRequest.PlaceOrderRequest;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)

public record CartEvent(
        Long orderId,String email,
        PlaceOrderRequest placeOrderReq 
) {}

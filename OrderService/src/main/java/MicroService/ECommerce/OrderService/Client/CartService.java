package MicroService.ECommerce.OrderService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;

/**
 * CartService
 */
@FeignClient(name = "cart-service")
public interface CartService {
    @GetMapping("/api/v1/cart/{userId}/")
    public PlaceOrderRequest placeOrderDetails(@PathVariable("userId") long userId);

    
}
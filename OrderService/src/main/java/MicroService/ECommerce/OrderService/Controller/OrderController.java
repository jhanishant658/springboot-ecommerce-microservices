package MicroService.ECommerce.OrderService.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.OrderService.Service.OrderService;
import lombok.AllArgsConstructor;

/**
 * OrderController
 */
@RestController
@RequestMapping("api/v1/order")
@AllArgsConstructor
public class OrderController {
   private final OrderService orderService ;
    
}
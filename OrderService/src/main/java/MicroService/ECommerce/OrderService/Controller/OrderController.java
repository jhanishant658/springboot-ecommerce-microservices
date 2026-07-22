package MicroService.ECommerce.OrderService.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.OrderService.Model.Order;

import MicroService.ECommerce.OrderService.Service.OrderService;
import MicroService.ECommerce.OrderService.Res.OrderDetail;
import lombok.AllArgsConstructor;

/**
 * OrderController
 */
@RestController
@RequestMapping("api/v1/order")
@AllArgsConstructor
public class OrderController {
   private final OrderService orderService ;

   @PostMapping("/placeOrder/{id}")
   public Order PlaceOrder(@PathVariable long id){
      return orderService.PlaceOrder(id);
   }
   @GetMapping("/orderHistory/{userId}")
   public List<Order> getOrdersByUserId(@PathVariable long userId) {
       return orderService.getOrdersByUserId(userId);
   }
   @PatchMapping("/updateOrderStatus/{orderId}/{status}")
   public String updateOrderStatus(@PathVariable long orderId, @PathVariable String status) {
       return orderService.updateOrderStatus(orderId, status);
   }
   @GetMapping("/getOrderDetails/{orderId}")
   public OrderDetail getOrderById(@PathVariable long orderId) {
       return orderService.getOrderById(orderId);
   }
    
}
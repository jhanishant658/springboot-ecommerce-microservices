package MicroService.ECommerce.OrderService.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import MicroService.ECommerce.OrderService.Repository.OrderRepo;
import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;
import MicroService.ECommerce.OrderService.Client.CartService;
import MicroService.ECommerce.OrderService.Model.Order;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {
  private final OrderRepo orderRepo ;
  private final CartService cartService ;
  public Order PlaceOrder(long userId) {
    Order order = new Order();
    PlaceOrderRequest req = cartService.placeOrderDetails(userId);  
    order.setUserId(req.getUserId());
    order.setProducts(req.getProducts());
    order.setTotalAmount(req.getTotalAmount());
    order.setStatus("Placed");
    order.setDate(java.time.LocalDateTime.now());
    return orderRepo.save(order);
  }
  // this method help to get user order history
  public List<Order> getOrdersByUserId(long userId) {
      return orderRepo.findByUserIdOrderByDateDesc(userId);
  }
// this method help you to update the status of specific order  
  public String updateOrderStatus(long orderId, String status) {
    Order order = orderRepo.findById(orderId).orElse(null);
    if (order == null) {
        return "Order not found";
    }
    order.setStatus(status);
    orderRepo.save(order);
    return "Order status updated successfully";
  }
  // this method help you to find the detail of specific order
  public Order getOrderById(long orderId) {
    return orderRepo.findById(orderId).orElse(null);
  }

    
}
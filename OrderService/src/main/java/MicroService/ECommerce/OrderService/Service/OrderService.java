package MicroService.ECommerce.OrderService.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import MicroService.ECommerce.OrderService.Repository.OrderRepo;
import MicroService.ECommerce.OrderService.Request.CartProduct;
import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;
import MicroService.ECommerce.Response.OrderDetail;
import MicroService.ECommerce.OrderService.Client.CartService;
import MicroService.ECommerce.OrderService.Client.ProductService;
import MicroService.ECommerce.OrderService.Model.Order;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {
  private final OrderRepo orderRepo ;
  private final CartService cartService ;
  private final ProductService productService ;
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
  public OrderDetail getOrderById(long orderId) {
    Order order =  orderRepo.findById(orderId).orElse(null);
    OrderDetail orderDetail = new OrderDetail();
    if (order != null) {
        List<Long> quantityList = order.getProducts().stream()
                .map(product -> product.getQuantity())
                .toList();
        List<Long> productIdList = order.getProducts().stream()
                .map(product -> product.getId())
                .toList();
        List<CartProduct> productList = productService.getProductsByIds(productIdList);
        orderDetail.setProducts(productList);
        orderDetail.setTotalAmount(order.getTotalAmount());
        orderDetail.setQuantity(quantityList);
        orderDetail.setStatus(order.getStatus());
        orderDetail.setDate(order.getDate());
    }
    return orderDetail ; 
  }

    
}
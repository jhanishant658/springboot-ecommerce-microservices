package MicroService.ECommerce.OrderService.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import MicroService.ECommerce.OrderService.Repository.OrderRepo;
import MicroService.ECommerce.OrderService.Request.CartProduct;
import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;
import MicroService.ECommerce.OrderService.Res.OrderDetail;
import MicroService.ECommerce.OrderService.Client.ProductService;
import MicroService.ECommerce.OrderService.Events.CartEvent;
import MicroService.ECommerce.OrderService.Events.EventType;
import MicroService.ECommerce.OrderService.Events.OrderEvents;
import MicroService.ECommerce.OrderService.Events.PaymentResponse;
import MicroService.ECommerce.OrderService.Model.Order;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {
  private final OrderRepo orderRepo ;
 // private final CartService cartService ;
  private final ProductService productService ;
  private final KafkaTemplate<String, OrderEvents> kafkaTemplate ;
  public Order PlaceOrder(long userId) {
    // place order with default data 
    Order order = new Order();
   PlaceOrderRequest req = new PlaceOrderRequest(
     
   );
req.setUserId(userId);
req.setProducts(null);
req.setTotalAmount(0);
order.setUserId(req.getUserId());
order.setProducts(req.getProducts());
order.setTotalAmount(req.getTotalAmount());
order.setStatus("PENDING");
order.setDate(java.time.LocalDateTime.now());
     orderRepo.save(order);
     log.info("order placed with default data");
     OrderEvents events = new OrderEvents(
      order.getId() ,
      userId,
      "njha5901@gmail.com",
      EventType.PENDING,
      order.getStatus(),
      order.getDate(),
      BigDecimal.valueOf(0)
     );

     try {
        //say cart to send his data 
    var result = kafkaTemplate.send("order-placed", events).get();

log.info("Topic     : {}", result.getRecordMetadata().topic());
log.info("Partition : {}", result.getRecordMetadata().partition());
log.info("Offset    : {}", result.getRecordMetadata().offset());
    log.info("Kafka send SUCCESS");
} catch (Exception e) {
    e.printStackTrace();
}
  return order ; 
  }
  // this method help to get user order history
  public List<Order> getOrdersByUserId(long userId) {
      return orderRepo.findByUserIdOrderByDateDesc(userId);
  }
// this method help you to update the status of specific order  
  public String updateOrderStatus(long orderId, String status) {
    log.info("order update req iniatlized");
    Order order = orderRepo.findById(orderId).orElse(null);
    if (order == null) {
        return "Order not found";
    }
    order.setStatus(status);
    orderRepo.save(order);
    OrderEvents events = new OrderEvents(
      order.getId() ,
      order.getUserId(),
      "njha5901@gmail.com",
      EventType.ORDER_STATUS_UPDATED,
      order.getStatus(),
      order.getDate() ,
      BigDecimal.valueOf(order.getTotalAmount()),null
     );
    try {
    var result = kafkaTemplate.send("order-placed", events).get();

log.info("Topic     : {}", result.getRecordMetadata().topic());
log.info("Partition : {}", result.getRecordMetadata().partition());
log.info("Offset    : {}", result.getRecordMetadata().offset());
    log.info("Kafka send SUCCESS");
} catch (Exception e) {
    e.printStackTrace();
}
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
  @KafkaListener(topics ="cart-event",groupId = "order-group", containerFactory = "kafkaListenerContainerFactory")
public void PlaceOrderFromCart(CartEvent event){
    // take data from cart 
  log.info("placing the order with actual data");
       long orderId = event.orderId();
       PlaceOrderRequest req = event.placeOrderReq();
       Order order =  orderRepo.findById(orderId).orElse(null);
        order.setUserId(req.getUserId());
    order.setProducts(req.getProducts());
    order.setTotalAmount(req.getTotalAmount());
    order.setStatus("Created");
    order.setDate(java.time.LocalDateTime.now());
    orderRepo.save(order);
     OrderEvents paymentEvent = new OrderEvents(
      order.getId() ,
      order.getUserId(),
      "njha5901@gmail.com",
      EventType.PAYMENT_PENDING,
      order.getStatus(),
      order.getDate(),
      BigDecimal.valueOf(order.getTotalAmount()),
      null
     );
     //say payment service to pay 
     kafkaTemplate.send("order-placed",paymentEvent);
     
}
@KafkaListener(topics = "payment-event",groupId = "order-group", containerFactory = "PaymentkafkaListenerContainerFactory")
@Transactional
public void paymentStatus(PaymentResponse res){
Order order =  orderRepo.findById(res.orderId()).orElse(null);
    if(res.status()==PaymentStatus.SUCCESS){

        log.info("payment recieved");
     
    OrderEvents inventoryEvent = new OrderEvents(
      res.orderId() ,
      res.userId(),
      "njha5901@gmail.com",
      EventType.INVENTORY_REQUEST,
     "Payment_SUccess",
      order.getDate(),
      res.amount() ,
      order.getProducts()
     );
        kafkaTemplate.send("order-placed",inventoryEvent);
        return ; 
    }
    updateOrderStatus(order.getOrderId(),"Low_Balance");
}
@KafkaListener(topics = "Inventory-event",groupId = "order-group", containerFactory = "InventorykafkaListenerContainerFactory")
// for clearing cart or sending mail to user
public void OrderPlacedOrNot(InventoryEvent event){
   Order order = orderRepo.findById(event.orderId()).orElse(null);

    if(event.status()==Status.SUCCESS){
      
        OrderEvents events = new OrderEvents(
      event.orderId() ,
      order.getUserId(),
      "njha5901@gmail.com",
      EventType.ORDER_PLACED,
     "Placed",
      order.getDate(),
      res.amount() ,
      order.getProducts()
     );
     KafkaTemplate.send("order-placed",events);
     order.setStatus("Placed");
    }
    else{
 OrderEvents events = new OrderEvents(
      event.orderId() ,
      order.getUserId(),
      "njha5901@gmail.com",
      EventType.REFUND,
     "Placed",
      order.getDate(),
      res.amount() ,
      order.getProducts()
     );
     KafkaTemplate.send("order-placed",events);
     
        order.setStatus("Cancelled");
    }
}

    
}
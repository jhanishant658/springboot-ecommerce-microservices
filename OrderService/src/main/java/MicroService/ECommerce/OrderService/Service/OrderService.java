package MicroService.ECommerce.OrderService.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import MicroService.ECommerce.OrderService.Repository.OrderRepo;
import MicroService.ECommerce.OrderService.Request.CartProduct;
import MicroService.ECommerce.OrderService.Request.PlaceOrderRequest;
import MicroService.ECommerce.OrderService.Res.OrderDetail;
import jakarta.transaction.Transactional;
import MicroService.ECommerce.OrderService.Client.ProductService;
import MicroService.ECommerce.OrderService.Security.UserContext;
import MicroService.ECommerce.OrderService.Events.CartEvent;
import MicroService.ECommerce.OrderService.Events.EventType;
import MicroService.ECommerce.OrderService.Events.InventoryEvent;
import MicroService.ECommerce.OrderService.Events.OrderEvents;
import MicroService.ECommerce.OrderService.Events.PaymentEvent;
import MicroService.ECommerce.OrderService.Events.PaymentStatus;
import MicroService.ECommerce.OrderService.Events.Status;
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
  private final UserContext userContext ;
  private final RedisService redisService ;
  public String PlaceOrder() {
    String email = userContext.getEmail();
Long userId = userContext.getUserId();
    // place order with default data 
   
   
     log.info("order placed with default data");
     OrderEvents events = new OrderEvents(
      0L ,
      userId,
      email,
      EventType.ORDER_PENDING,
      "Pending",
      LocalDateTime.now(),
      
      BigDecimal.valueOf(0),null
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
  return "order placed successfully"; 
  }
  // this method help to get user order history
 public List<Order> getOrdersByUserId() {

    Long userId = userContext.getUserId();

    List<Order> cachedOrders =
            redisService.get(
                    "orderHistory.userId" + userId,
                    List.class
            );

    Boolean cachedOrdersUpdated = null;

    if (cachedOrders != null) {
        cachedOrdersUpdated =
                redisService.get(
                        "orderHistory.userId.updated" + userId,
                        Boolean.class
                );
    }

    if (cachedOrders != null &&
            Boolean.FALSE.equals(cachedOrdersUpdated)) {

        log.info(
                "Retrieved order history for user {} from Redis",
                userId
        );

        return cachedOrders;
    }

    List<Order> orders =
            orderRepo.findByUserIdOrderByDateDesc(userId);

    redisService.set(
            "orderHistory.userId" + userId,
            orders
    );

    redisService.set(
            "orderHistory.userId.updated" + userId,
            false
    );

    return orders;
}
// this method help you to update the status of specific order  
  public String updateOrderStatus(long orderId, String status) {
    String email = userContext.getEmail();
    log.info("order update req iniatlized");
    Order order = orderRepo.findById(orderId).orElse(null);
    if (order == null) {
        return "Order not found";
    }
    order.setStatus(status);
    orderRepo.save(order);
    redisService.set("orderHistory.userId.updated"+order.getUserId() , true);
    redisService.set("orderDetail.orderId.updated"+orderId , true);
    OrderEvents events = new OrderEvents(
      order.getId() ,
      order.getUserId(),
      email,
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
   Boolean cachedOrderDetailUpdated = null;
OrderDetail cachedrderDetail =
        redisService.get(
                "orderDetail.orderId" + orderId,
                OrderDetail.class
        );
if (cachedrderDetail != null) {
    cachedOrderDetailUpdated =
            redisService.get(
                    "orderDetail.orderId.updated" + orderId,
                    Boolean.class
            );
}

if (cachedrderDetail != null &&
        Boolean.FALSE.equals(cachedOrderDetailUpdated)) {

    return cachedrderDetail;
}
    Order order =  orderRepo.findById(orderId).orElse(null);
    if(order==null)return null;
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
    redisService.set("orderDetail.orderId"+orderId , orderDetail);
    redisService.set("orderDetail.orderId.updated"+orderId , false);
    return orderDetail ; 
  }
@KafkaListener(topics ="cart-event",groupId = "order-group", containerFactory = "kafkaListenerContainerFactory")
public void PlaceOrderFromCart(CartEvent event){
   
  if(event.orderId()==null) return ; 
    // take data from cart 
  log.info("placing the order with actual data");
       
       PlaceOrderRequest req = event.placeOrderReq();
       Order order =  new Order();
        order.setUserId(req.getUserId());
    order.setProducts(req.getProducts());
    order.setTotalAmount(req.getTotalAmount());
    order.setStatus("Created");
    order.setDate(java.time.LocalDateTime.now());
    orderRepo.save(order);
    redisService.set("orderHistory.userId.updated"+order.getUserId() , true);
    
     OrderEvents paymentEvent = new OrderEvents(
      order.getId() ,
      order.getUserId(),
      event.email(),
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
public void paymentStatus(PaymentEvent res){
   
    
    Order order =  orderRepo.findById(res.orderId()).orElse(null);
    if(res.status()==PaymentStatus.SUCCESS){

        log.info("payment recieved");
     
    OrderEvents inventoryEvent = new OrderEvents(
      res.orderId() ,
      res.userId(),
      res.email(),
      EventType.INVENTORY_REQUEST,
     "Payment_SUccess",
      order.getDate(),
      res.amount() ,
      order.getProducts()
     );
        kafkaTemplate.send("order-placed",inventoryEvent);
        return ; 
    }
    order.setStatus("Payment_Failed");
    orderRepo.save(order);
    redisService.set(
        "orderHistory.userId.updated" + order.getUserId(),
        true
);

redisService.set(
        "orderDetail.orderId.updated" + order.getId(),
        true
);
}
@KafkaListener(topics = "Inventory-event",groupId = "order-group-v3", containerFactory = "InventorykafkaListenerContainerFactory")
// for clearing cart or sending mail to user
public void OrderPlacedOrNot(InventoryEvent event){
    
   Order order = orderRepo.findById(event.orderId()).orElse(null);

    if(event.status()==Status.SUCCESS){
      
        OrderEvents events = new OrderEvents(
      event.orderId() ,
      order.getUserId(),
      event.email(),
      EventType.ORDER_PLACED,
     "Placed",
      order.getDate(),
      BigDecimal.valueOf(order.getTotalAmount()) ,
      order.getProducts()
     );
     kafkaTemplate.send("order-placed",events);
     order.setStatus("Placed");
    }
    else{
 OrderEvents events = new OrderEvents(
      event.orderId() ,
      order.getUserId(),
     event.email(),
      EventType.REFUND,
     "cancelled",
      order.getDate(),
      BigDecimal.valueOf(order.getTotalAmount()) ,
      order.getProducts()
     );
     kafkaTemplate.send("order-placed",events);
     
        order.setStatus("Cancelled");
    }
    orderRepo.save(order);
    redisService.set(
        "orderHistory.userId.updated" + order.getUserId(),
        true
);

redisService.set(
        "orderDetail.orderId.updated" + order.getId(),
        true
);
}

    
}
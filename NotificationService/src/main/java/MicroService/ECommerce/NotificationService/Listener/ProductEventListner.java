package MicroService.ECommerce.NotificationService.Listener;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Repository.NotificationRepository;
import MicroService.ECommerce.NotificationService.Repository.UserRepositoy;
import MicroService.ECommerce.NotificationService.Service.NotificationService;
import MicroService.ECommerce.NotificationService.Events.ProductEvent;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Model.Users;
import lombok.AllArgsConstructor;
import java.util.List;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@AllArgsConstructor
@Slf4j
public class ProductEventListner{
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UserRepositoy userRepository ; 
      @KafkaListener(topics = "cart-event", groupId = "notification-group-v3", containerFactory = "productKafkaListenerContainerFactory")
      public void consumeProductEvent(ProductEvent productEvent) {
          log.info("Received Product Event: {}", productEvent);
          if(productEvent.productId() == null || productEvent.stock() <= 0){
              log.info("Product with ID: {} is out of stock. No notification will be sent.", productEvent.productId());
              return;
          }
          // Handle the product event (e.g., send notification)
          List<Users> user = userRepository.findAll();
          String message = "There is a new Product with ID: " + productEvent.productId() + " and Stock: " + productEvent.stock() + " has been created. please check it out.";
          String subject = "New Product Created";
                for(Users userDetail: user){
                    NotificationDtos.NotificationRequest notificationRequest = new NotificationDtos.NotificationRequest(userDetail.getUserId(), userDetail.getEmail(), Notification.Channel.EMAIL, subject, message);
                    notificationService.send(notificationRequest);
                }
      }
      
}
package MicroService.ECommerce.NotificationService.Listener;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Repository.NotificationRepository;
import MicroService.ECommerce.NotificationService.Service.NotificationService;
import MicroService.ECommerce.NotificationService.Events.ProductEvent;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Dto.UserDetail;
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

      @KafkaListener(topics = "cart-event", groupId = "inventory-group", containerFactory = "productKafkaListenerContainerFactory")
      public void consumeProductEvent(ProductEvent productEvent) {
          log.info("Received Product Event: {}", productEvent);
          // Handle the product event (e.g., send notification)
          List<UserDetail> userDetails = notificationRepository.findAllUserDetails();
          String message = "There is a new Product with ID: " + productEvent.productId() + " and Stock: " + productEvent.stock() + " has been created. please check it out.";
          String subject = "New Product Created";
                for(UserDetail userDetail: userDetails){
                    NotificationDtos.NotificationRequest notificationRequest = new NotificationDtos.NotificationRequest(userDetail.userId(), userDetail.email(), Notification.Channel.EMAIL, subject, message);
                    notificationService.send(notificationRequest);
                }
      }
      
}
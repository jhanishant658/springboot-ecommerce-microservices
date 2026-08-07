package MicroService.ECommerce.NotificationService.Listener;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Events.OrderEvents;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes MicroService.ECommerce.OrderService's "order-placed" topic and
 * turns each OrderEvents into an actual email notification.
 *
 * NOTE: OrderEvents only carries userId, not an email address. resolveEmail()
 * below is a placeholder - you said you'll wire up the real userId -> email
 * lookup (e.g. a UserService endpoint or enriching the event itself), so this
 * just isolates that single missing piece behind one method for you to swap out.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final NotificationService notificationService;

  
    private void onOrderEvent(OrderEvents event) {
        log.info("Received order event: orderId={}, userId={}, eventType={}, status={}",
                event.orderId(), event.userId(), event.eventType(), event.status());

        String recipient = event.email();
        if (recipient == null) {
            log.warn("No email resolved for userId={}, skipping notification for orderId={}",
                    event.userId(), event.orderId());
            return;
        }

        String subject = subjectFor(event);
        String body = bodyFor(event);

        notificationService.send(new NotificationDtos.NotificationRequest(
                event.userId(), recipient, Notification.Channel.EMAIL, subject, body));
    }

    private String subjectFor(OrderEvents event) {
        return switch (event.eventType()) {
            case ORDER_PLACED -> "Your order #" + event.orderId() + " has been placed";
            case ORDER_PENDING -> "Your order #" + event.orderId() + " is pending";
             default -> "Not Sure about it ";
        };
    }

    private String bodyFor(OrderEvents event) {
        return "Hi,<br><br>Your order <b>#" + event.orderId() + "</b> status is now: <b>"
                + event.status() + "</b>.<br><br>Thanks for shopping with us.";
    }
    private void onOrderStatusChange(OrderEvents event){
         log.info("Received order event: orderId={}, userId={}, eventType={}, status={}",
                event.orderId(), event.userId(), event.eventType(), event.status());

        String recipient = event.email();
        if (recipient == null) {
            log.warn("No email resolved for userId={}, skipping notification for orderId={}",
                    event.userId(), event.orderId());
            return;
        }

        String subject = "Order Status updated Successfully";
        String body = bodyFor(event);

        notificationService.send(new NotificationDtos.NotificationRequest(
                event.userId(), recipient, Notification.Channel.EMAIL, subject, body));
    }
    @KafkaListener(topics = "order-placed", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void KafkaListnerOfOrderService(OrderEvents event){
        switch(event.eventType()){
            case ORDER_PLACED :
                onOrderEvent(event);
                break;
            case ORDER_STATUS_UPDATED:
                onOrderStatusChange(event);
                break ; 
            default :
               break ; 
        }
    }
    
}

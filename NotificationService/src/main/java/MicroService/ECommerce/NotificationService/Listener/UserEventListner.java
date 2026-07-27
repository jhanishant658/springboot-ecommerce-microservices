package MicroService.ECommerce.NotificationService.Listener;
import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Dto.NotificationDtos.UserEvent;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes MicroService.ECommerce.userService's "user-placed" topic and
 * turns each userEvents into an actual email notification.
 *
 * NOTE: userEvents only carries userId, not an email address. resolveEmail()
 * below is a placeholder - you said you'll wire up the real userId -> email
 * lookup (e.g. a UserService endpoint or enriching the event itself), so this
 * just isolates that single missing piece behind one method for you to swap out.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListner {

    private final NotificationService notificationService;
    
    @KafkaListener(topics = "user-event", groupId = "notification-group", containerFactory = "userkafkaListenerContainerFactory")
    public void sendEmailVerification(UserEvent event){
log.info("Received user event: email={}, otp={}",
                event.email(), event.otp());

        String recipient = event.email();
        if (recipient == null) {
            log.warn("No email resolved for event, skipping notification. email is null");
            return;
        }

        String subject = "Email Verification - One-Time Password (OTP)";

String body = """
Hello,

Thank you for registering with our platform.

Your One-Time Password (OTP) for email verification is:

%s

This OTP is valid for the next 5 minutes. Please do not share it with anyone.

If you did not request this verification, you can safely ignore this email.

Thank you,
E-Commerce Team
""".formatted(event.otp());

          // NotificationRequest constructor doesn't include an id in this build
          notificationService.send(new NotificationDtos.NotificationRequest(
             0L, recipient, Notification.Channel.EMAIL, subject, body));
    }
    
}

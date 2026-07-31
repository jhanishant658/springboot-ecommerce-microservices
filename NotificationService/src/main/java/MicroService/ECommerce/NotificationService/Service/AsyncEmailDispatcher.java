package MicroService.ECommerce.NotificationService.Service;

import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Repository.NotificationRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Kept as its own bean (rather than a method on NotificationService) so that
 * @Async actually takes effect - Spring's async proxy only intercepts calls
 * made from a *different* bean, not self-invoked calls within the same class.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AsyncEmailDispatcher {

    private final EmailSenderService emailSenderService;
    private final NotificationRepository notificationRepository;

    @Async
    public void dispatch(Long notificationId, String recipient, String subject, String message) {
        try {
            emailSenderService.sendEmail(recipient, subject, message);
            if(notificationId==null||notificationId==0L) return ;
            notificationRepository.findById(notificationId).ifPresent(n -> {
                n.setStatus(Notification.Status.SENT);
                n.setSentAt(Instant.now());
                notificationRepository.save(n);
            });
        } catch (MessagingException e) {
            log.error("Failed to send email notification {} to {}: {}", notificationId, recipient, e.getMessage());
            notificationRepository.findById(notificationId).ifPresent(n -> {
                n.setStatus(Notification.Status.FAILED);
                n.setErrorMessage(e.getMessage());
                notificationRepository.save(n);
            });
        }
    }
}

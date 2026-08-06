package MicroService.ECommerce.NotificationService.Service;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Repository.NotificationRepository;
import MicroService.ECommerce.NotificationService.Security.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final AsyncEmailDispatcher asyncEmailDispatcher;
    private final UserContext userContext;

    /**
     * Persists the notification immediately (so it shows up in the site's
     * notification list right away) and, for EMAIL channel, dispatches the
     * actual email asynchronously. The DB row's status is updated to SENT or
     * FAILED once the send attempt completes.
     */
    public NotificationDtos.NotificationResponse send(NotificationDtos.NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.userId())
                .recipient(request.recipient())
                .channel(request.channel())
                .subject(request.subject())
                
                .sentAt(Instant.now())
                .status(Notification.Status.PENDING)
                .build();
if(request.userId()!=0L){
        notification = notificationRepository.save(notification);}
        log.info("Queued {} notification {} to {}: {}", request.channel(), notification.getId(),
                request.recipient(), request.subject());

        if (request.channel() == Notification.Channel.EMAIL) {
            asyncEmailDispatcher.dispatch(notification.getId(), request.recipient(),
                    request.subject(), request.message());
        } else {
            log.info("Channel {} has no dispatcher configured yet; leaving as PENDING", request.channel());
        }

        return toResponse(notification);
    }

    public List<NotificationDtos.NotificationResponse> userNotifications() {
        Long userId = userContext.getUserId();
        return notificationRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    private NotificationDtos.NotificationResponse toResponse(Notification notification) {
        return new NotificationDtos.NotificationResponse(notification.getId(), notification.getUserId(),
                notification.getRecipient(), notification.getChannel(), notification.getSubject(),
                 notification.getSentAt(), notification.getStatus(),
                notification.getErrorMessage());
    }
}

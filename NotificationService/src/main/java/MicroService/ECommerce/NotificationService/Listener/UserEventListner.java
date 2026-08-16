package MicroService.ECommerce.NotificationService.Listener;
import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Dto.NotificationDtos.UserEvent;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Model.Users;
import MicroService.ECommerce.NotificationService.Repository.UserRepositoy;
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
    private final UserRepositoy userRepository ; 
    
   
 public void sendEmailVerification(UserEvent event){
        
log.info("Received user event: email={}, otp={}",
                event.email(), event.otp());

        String recipient = event.email();
        if (recipient == null) {
            log.warn("No email resolved for event, skipping notification. email is null");
            return;
        }

    String subject = "Email Verification — Your One-Time Password";

    String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0; padding:0; background:#f4f6f8;
                         font-family:Arial, Helvetica, sans-serif;">

                <div style="max-width:600px; margin:40px auto;
                            background:#ffffff; border-radius:10px;
                            overflow:hidden;">

                    <div style="background:#111827; padding:25px;
                                text-align:center;">
                        <h1 style="margin:0; color:#ffffff; font-size:24px;">
                            Email Verification
                        </h1>
                    </div>

                    <div style="padding:30px;">

                        <p style="font-size:16px; color:#374151;">
                            Hello,
                        </p>

                        <p style="font-size:15px; color:#4b5563;
                                  line-height:1.6;">
                            Thank you for registering with E-Commerce.
                            Please use the One-Time Password below to verify
                            your email address.
                        </p>

                        <div style="margin:30px 0; padding:20px;
                                    background:#f9fafb;
                                    border:1px solid #e5e7eb;
                                    border-radius:8px;
                                    text-align:center;">

                            <p style="margin:0 0 10px;
                                      color:#6b7280;
                                      font-size:13px;">
                                YOUR VERIFICATION CODE
                            </p>

                            <div style="font-size:32px;
                                        font-weight:bold;
                                        letter-spacing:8px;
                                        color:#111827;">
                                %s
                            </div>

                            <p style="margin:15px 0 0;
                                      color:#6b7280;
                                      font-size:13px;">
                                This code is valid for 5 minutes.
                            </p>

                        </div>

                        <p style="font-size:14px; color:#4b5563;
                                  line-height:1.6;">
                            For your security, please do not share this
                            verification code with anyone.
                        </p>

                        <p style="font-size:14px; color:#4b5563;
                                  line-height:1.6;">
                            If you did not request this verification,
                            you can safely ignore this email.
                        </p>

                        <p style="margin-top:30px;
                                  font-size:15px;
                                  color:#374151;">
                            Regards,<br>
                            <strong>E-Commerce Team</strong>
                        </p>

                    </div>

                    <div style="background:#f9fafb;
                                padding:18px;
                                text-align:center;">

                        <p style="margin:0;
                                  font-size:12px;
                                  color:#9ca3af;">
                            This is an automated email.
                            Please do not reply to this message.
                        </p>

                    </div>

                </div>

            </body>
            </html>
            """.formatted(event.otp());



          // NotificationRequest constructor doesn't include an id in this build
          notificationService.send(new NotificationDtos.NotificationRequest(
             0L, recipient, Notification.Channel.EMAIL, subject, body));
    }
    
   public void sendGreetingMessage(UserEvent event) {
    String recipient = event.email();
      String subject = "Welcome to E-Commerce! 🎉";

    String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0; padding:0; background:#f4f6f8;
                         font-family:Arial, Helvetica, sans-serif;">

                <div style="max-width:600px; margin:40px auto;
                            background:#ffffff; border-radius:10px;
                            overflow:hidden;">

                    <div style="background:#111827; padding:25px;
                                text-align:center;">

                        <h1 style="margin:0; color:#ffffff;
                                   font-size:24px;">
                            Welcome to E-Commerce 🎉
                        </h1>

                    </div>

                    <div style="padding:30px;">

                        <p style="font-size:16px; color:#374151;">
                            Hello,
                        </p>

                        <p style="font-size:15px; color:#4b5563;
                                  line-height:1.6;">
                            Welcome to E-Commerce! We're excited to have
                            you as part of our community.
                        </p>

                        <p style="font-size:15px; color:#4b5563;
                                  line-height:1.6;">
                            Your account has been successfully created.
                            You can now start exploring our platform.
                        </p>

                        <div style="margin:25px 0;
                                    padding:20px;
                                    background:#f9fafb;
                                    border:1px solid #e5e7eb;
                                    border-radius:8px;">

                            <h3 style="margin-top:0;
                                       color:#111827;">
                                What you can do
                            </h3>

                            <p style="margin:10px 0;
                                      color:#4b5563;">
                                🛍️ Browse products
                            </p>

                            <p style="margin:10px 0;
                                      color:#4b5563;">
                                ❤️ Save your favorite items
                            </p>

                            <p style="margin:10px 0;
                                      color:#4b5563;">
                                🛒 Add products to your cart
                            </p>

                            <p style="margin:10px 0;
                                      color:#4b5563;">
                                📦 Place and track your orders
                            </p>

                        </div>

                        <p style="font-size:15px;
                                  color:#4b5563;
                                  line-height:1.6;">
                            We hope you have a great shopping experience
                            with us.
                        </p>

                        <p style="font-size:15px;
                                  color:#4b5563;
                                  line-height:1.6;">
                            If you need any assistance, feel free to
                            contact our support team.
                        </p>

                        <p style="margin-top:30px;
                                  color:#374151;">
                            Happy Shopping! 🛒
                        </p>

                        <p style="font-size:15px;
                                  color:#374151;">
                            Regards,<br>
                            <strong>E-Commerce Team</strong>
                        </p>

                    </div>

                    <div style="background:#f9fafb;
                                padding:18px;
                                text-align:center;">

                        <p style="margin:0;
                                  font-size:12px;
                                  color:#9ca3af;">
                            This is an automated email.
                            Please do not reply to this message.
                        </p>

                    </div>

                </div>

            </body>
            </html>
            """;
        Users user = new Users();
        user.setUserId(event.userId());
        user.setEmail(recipient);
        userRepository.save(user);
    notificationService.send(new NotificationDtos.NotificationRequest(
            event.userId(),
            recipient,
            Notification.Channel.EMAIL,
            subject,
            body
    ));
}
 @KafkaListener(topics = "user-event", groupId = "notification-group", containerFactory = "userkafkaListenerContainerFactory")
     public void sendMessagetoUser(UserEvent event){
        if (event.userId() == 0) {
            sendEmailVerification(event);
        }
        else{
            sendGreetingMessage(event);
        }
     }
}

package MicroService.ECommerce.NotificationService.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Actually dispatches emails over SMTP.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSenderService {

    private final JavaMailSender mailSender;

    @Value("${notification.mail.from}")
    private String fromAddress;

    private static final int MAX_ATTEMPTS = 3;

    /**
     * Sends a real email. Retries a couple of times (with backoff) on transient
     * SMTP failures - network blip, provider throttling - before giving up.
     *
     * @throws MessagingException if the message could not be sent after all retries
     */
    public void sendEmail(String to, String subject, String body) throws MessagingException {
        int attempt = 0;
        while (true) {
            attempt++;
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
                helper.setFrom(fromAddress);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body, true);

                mailSender.send(mimeMessage);
                log.info("Email sent to {} with subject '{}' (attempt {})", to, subject, attempt);
                return;
            } catch (MessagingException | MailException e) {
                log.warn("Email send attempt {}/{} to {} failed: {}", attempt, MAX_ATTEMPTS, to, e.getMessage());
                if (attempt >= MAX_ATTEMPTS) {
                    throw (e instanceof MessagingException me) ? me
                            : new MessagingException("Failed to send email after " + MAX_ATTEMPTS + " attempts", e);
                }
                sleepBeforeRetry(attempt);
            }
        }
    }

    private void sleepBeforeRetry(int attempt) {
        try {
            Thread.sleep(1000L * attempt); // linear backoff: 1s, 2s, ...
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }
}

package MicroService.ECommerce.NotificationService.Listener;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Events.OrderEvents;
import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "order-placed",
            groupId = "notification-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void kafkaListenerOfOrderService(OrderEvents event) {

        log.info(
                "Received order event: orderId={}, userId={}, eventType={}, status={}",
                event.orderId(),
                event.userId(),
                event.eventType(),
                event.status()
        );

        switch (event.eventType()) {

            case ORDER_PLACED:
                sendOrderPlacedEmail(event);
                break;

            case ORDER_STATUS_UPDATED:
                sendOrderStatusUpdatedEmail(event);
                break;

            case REFUND:
                sendRefundEmail(event);
                break;

            default:
                log.warn(
                        "Unhandled order event type: {} for orderId={}",
                        event.eventType(),
                        event.orderId()
                );
        }
    }

    private void sendOrderPlacedEmail(OrderEvents event) {

        String subject = "Order #" + event.orderId() + " Confirmed — Thank You for Your Purchase";

        String body = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Confirmed</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f4f6f8;
                             font-family:Arial, Helvetica, sans-serif;">

                    <div style="max-width:600px; margin:40px auto; background:#ffffff;
                                border-radius:10px; overflow:hidden;
                                box-shadow:0 2px 10px rgba(0,0,0,0.08);">

                        <div style="background:#111827; padding:25px;
                                    text-align:center;">

                            <h1 style="color:#ffffff; margin:0;
                                       font-size:24px;">
                                Order Confirmed
                            </h1>

                        </div>

                        <div style="padding:30px;">

                            <p style="font-size:16px; color:#374151;">
                                Hello,
                            </p>

                            <p style="font-size:16px; color:#374151; line-height:1.6;">
                                Thank you for shopping with us. Your order has been
                                successfully placed and is now being processed.
                            </p>

                            <div style="background:#f9fafb; border:1px solid #e5e7eb;
                                        border-radius:8px; padding:20px; margin:25px 0;">

                                <p style="margin:0 0 10px 0; color:#6b7280;
                                          font-size:14px;">
                                    ORDER ID
                                </p>

                                <p style="margin:0; font-size:20px; font-weight:bold;
                                          color:#111827;">
                                    #%s
                                </p>

                                <hr style="border:none; border-top:1px solid #e5e7eb;
                                           margin:15px 0;">

                                <p style="margin:0; color:#6b7280; font-size:14px;">
                                    STATUS
                                </p>

                                <p style="margin:5px 0 0 0; font-size:16px;
                                          font-weight:bold; color:#16a34a;">
                                    %s
                                </p>

                            </div>

                            <p style="font-size:15px; color:#4b5563;
                                      line-height:1.6;">
                                We will keep you updated as your order progresses.
                                You will receive another email whenever there is
                                an important update.
                            </p>

                            <p style="font-size:15px; color:#374151;">
                                Thank you for choosing us.
                            </p>

                            <p style="margin-top:30px; color:#374151;">
                                Regards,<br>
                                <strong>E-Commerce Team</strong>
                            </p>

                        </div>

                        <div style="background:#f9fafb; padding:20px;
                                    text-align:center;">

                            <p style="margin:0; font-size:12px; color:#9ca3af;">
                                This is an automated email. Please do not reply
                                to this message.
                            </p>

                        </div>

                    </div>

                </body>
                </html>
                """.formatted(
                        event.orderId(),
                        event.status()
                );

        sendEmail(event, subject, body);
    }

    private void sendOrderStatusUpdatedEmail(OrderEvents event) {

        String subject = "Order #" + event.orderId() + " — Status Update";

        String body = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Status Update</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f4f6f8;
                             font-family:Arial, Helvetica, sans-serif;">

                    <div style="max-width:600px; margin:40px auto; background:#ffffff;
                                border-radius:10px; overflow:hidden;
                                box-shadow:0 2px 10px rgba(0,0,0,0.08);">

                        <div style="background:#111827; padding:25px;
                                    text-align:center;">

                            <h1 style="color:#ffffff; margin:0;
                                       font-size:24px;">
                                Order Status Updated
                            </h1>

                        </div>

                        <div style="padding:30px;">

                            <p style="font-size:16px; color:#374151;">
                                Hello,
                            </p>

                            <p style="font-size:16px; color:#374151; line-height:1.6;">
                                There has been an update to your order.
                                Please find the latest status below.
                            </p>

                            <div style="background:#f9fafb; border:1px solid #e5e7eb;
                                        border-radius:8px; padding:20px; margin:25px 0;">

                                <p style="margin:0 0 10px; color:#6b7280;
                                          font-size:14px;">
                                    ORDER ID
                                </p>

                                <p style="margin:0; font-size:20px; font-weight:bold;
                                          color:#111827;">
                                    #%s
                                </p>

                                <hr style="border:none; border-top:1px solid #e5e7eb;
                                           margin:15px 0;">

                                <p style="margin:0; color:#6b7280; font-size:14px;">
                                    CURRENT STATUS
                                </p>

                                <p style="margin:5px 0 0; font-size:18px;
                                          font-weight:bold; color:#2563eb;">
                                    %s
                                </p>

                            </div>

                            <p style="font-size:15px; color:#4b5563;
                                      line-height:1.6;">
                                We will notify you when there are further updates
                                regarding your order.
                            </p>

                            <p style="margin-top:30px; color:#374151;">
                                Regards,<br>
                                <strong>E-Commerce Team</strong>
                            </p>

                        </div>

                        <div style="background:#f9fafb; padding:20px;
                                    text-align:center;">

                            <p style="margin:0; font-size:12px; color:#9ca3af;">
                                This is an automated email. Please do not reply
                                to this message.
                            </p>

                        </div>

                    </div>

                </body>
                </html>
                """.formatted(
                        event.orderId(),
                        event.status()
                );

        sendEmail(event, subject, body);
    }

    private void sendRefundEmail(OrderEvents event) {

        String subject = "Refund Initiated for Order #" + event.orderId();

        String body = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Refund Initiated</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f4f6f8;
                             font-family:Arial, Helvetica, sans-serif;">

                    <div style="max-width:600px; margin:40px auto; background:#ffffff;
                                border-radius:10px; overflow:hidden;
                                box-shadow:0 2px 10px rgba(0,0,0,0.08);">

                        <div style="background:#111827; padding:25px;
                                    text-align:center;">

                            <h1 style="color:#ffffff; margin:0;
                                       font-size:24px;">
                                Refund Initiated
                            </h1>

                        </div>

                        <div style="padding:30px;">

                            <p style="font-size:16px; color:#374151;">
                                Hello,
                            </p>

                            <p style="font-size:16px; color:#374151;
                                      line-height:1.6;">
                                Unfortunately, we were unable to fulfill your
                                order due to insufficient stock.
                            </p>

                            <div style="background:#fff7ed;
                                        border:1px solid #fed7aa;
                                        border-radius:8px;
                                        padding:20px;
                                        margin:25px 0;">

                                <p style="margin:0 0 10px; color:#9a3412;
                                          font-size:14px;">
                                    ORDER ID
                                </p>

                                <p style="margin:0; font-size:20px;
                                          font-weight:bold; color:#111827;">
                                    #%s
                                </p>

                                <p style="margin:15px 0 0; color:#7c2d12;
                                          line-height:1.5;">
                                    Your refund has been initiated and will be
                                    processed within 3–5 business days.
                                </p>

                            </div>

                            <p style="font-size:15px; color:#4b5563;
                                      line-height:1.6;">
                                We sincerely apologize for the inconvenience.
                                Thank you for your patience and understanding.
                            </p>

                            <p style="margin-top:30px; color:#374151;">
                                Regards,<br>
                                <strong>E-Commerce Team</strong>
                            </p>

                        </div>

                        <div style="background:#f9fafb; padding:20px;
                                    text-align:center;">

                            <p style="margin:0; font-size:12px; color:#9ca3af;">
                                This is an automated email. Please do not reply
                                to this message.
                            </p>

                        </div>

                    </div>

                </body>
                </html>
                """.formatted(event.orderId());

        sendEmail(event, subject, body);
    }

    private void sendEmail(
            OrderEvents event,
            String subject,
            String body
    ) {

        String recipient = event.email();

        if (recipient == null || recipient.isBlank()) {

            log.warn(
                    "No email found for userId={}, skipping notification for orderId={}",
                    event.userId(),
                    event.orderId()
            );

            return;
        }

        notificationService.send(
                new NotificationDtos.NotificationRequest(
                        event.userId(),
                        recipient,
                        Notification.Channel.EMAIL,
                        subject,
                        body
                )
        );

        log.info(
                "Email notification sent: orderId={}, recipient={}, subject={}",
                event.orderId(),
                recipient,
                subject
        );
    }
}
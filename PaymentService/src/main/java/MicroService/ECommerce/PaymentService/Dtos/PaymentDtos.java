package MicroService.ECommerce.PaymentService.Dtos;

import java.math.BigDecimal;
import java.time.Instant;

import MicroService.ECommerce.PaymentService.Model.Payment;

public class PaymentDtos {
    public record WalletRequest(Long userId) {}
    public record TopUpRequest(BigDecimal amount) {}
    public record PaymentRequest(Long orderId, Long userId, BigDecimal amount) {}
    public record WalletResponse(Long id , BigDecimal balance) {}
    public record PaymentResponse(Long id, Long orderId, Long userId, BigDecimal amount, Payment.PaymentStatus status, String message, Instant createdAt) {}
    public record PaymentEvent(
    Long orderId,
    Long userId,
    String email,
    BigDecimal amount,
    Payment.PaymentStatus status
) {} 
    public record UserEvent(Long userId , String email , Long otp){}
}

package MicroService.ECommerce.PaymentService.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MicroService.ECommerce.PaymentService.Dtos.PaymentDtos;
import MicroService.ECommerce.PaymentService.Dtos.PaymentDtos.WalletResponse;
import MicroService.ECommerce.PaymentService.Model.Payment;
import MicroService.ECommerce.PaymentService.Model.Wallet;
import MicroService.ECommerce.PaymentService.Repository.PaymentRepo;
import MicroService.ECommerce.PaymentService.Repository.WalletRepo;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final WalletRepo walletRepository;
    private final PaymentRepo paymentRepository;

    @Transactional
    public PaymentDtos.WalletResponse createWallet(PaymentDtos.WalletRequest request) {
        Wallet wallet = walletRepository.findById(request.userId())
                .orElseGet(() -> walletRepository.save(Wallet.builder().id(request.userId()).balance(BigDecimal.ZERO).build()));
        return toWalletResponse(wallet);
    }

    @Transactional
    public PaymentDtos.WalletResponse topUp(Long userId, PaymentDtos.TopUpRequest request) {
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Top-up amount must be positive");
        }
        Wallet wallet = walletRepository.findById(userId)
                .orElseGet(() -> walletRepository.save(Wallet.builder().id(userId).balance(BigDecimal.ZERO).build()));
        wallet.setBalance(wallet.getBalance().add(request.amount()));
        return toWalletResponse(walletRepository.save(wallet));
    }

    public PaymentDtos.WalletResponse wallet(Long userId) {
        return walletRepository.findById(userId).map(this::toWalletResponse)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
    }

    @Transactional
    public PaymentDtos.PaymentResponse pay(PaymentDtos.PaymentRequest request) {
        Wallet wallet = walletRepository.findById(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        Payment.PaymentStatus status;
        String message;
        if (wallet.getBalance().compareTo(request.amount()) >= 0) {
            wallet.setBalance(wallet.getBalance().subtract(request.amount()));
            walletRepository.save(wallet);
            status = Payment.PaymentStatus.SUCCESS;
            message = "Payment successful";
        } else {
            status = Payment.PaymentStatus.FAILED;
            message = "Insufficient wallet balance";
        }
        Payment payment = paymentRepository.save(Payment.builder()
                .orderId(request.orderId())
                .userId(request.userId())
                .amount(request.amount())
                .status(status)
                .message(message)
                .createdAt(Instant.now())
                .build());
        return toPaymentResponse(payment);
    }

  
    public List<PaymentDtos.PaymentResponse> payments(Long userId) {
        return paymentRepository.findByUserId(userId).stream().map(this::toPaymentResponse).toList();
    }
    private PaymentDtos.WalletResponse toWalletResponse(Wallet wallet) {
        return new PaymentDtos.WalletResponse( wallet.getId(), wallet.getBalance());
    }

    private PaymentDtos.PaymentResponse toPaymentResponse(Payment payment) {
        return new PaymentDtos.PaymentResponse(payment.getId(), payment.getOrderId(), payment.getUserId(),
                payment.getAmount(), payment.getStatus(), payment.getMessage(), payment.getCreatedAt());
    }
}
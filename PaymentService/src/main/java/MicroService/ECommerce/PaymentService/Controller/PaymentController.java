package MicroService.ECommerce.PaymentService.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.PaymentService.Dtos.PaymentDtos;
import MicroService.ECommerce.PaymentService.Service.PaymentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("wallets")
    public PaymentDtos.WalletResponse createWallet(@RequestBody PaymentDtos.WalletRequest request) {
        return paymentService.createWallet(request);
    }

    @GetMapping("wallets/{userId}")
    public PaymentDtos.WalletResponse wallet(@PathVariable Long userId) {
        return paymentService.wallet(userId);
    }

    @PostMapping("wallets/{userId}/top-up")
    public PaymentDtos.WalletResponse topUp(@PathVariable Long userId, @RequestBody PaymentDtos.TopUpRequest request) {
        return paymentService.topUp(userId, request);
    }



    @GetMapping("payments/users/{userId}")
    public List<PaymentDtos.PaymentResponse> payments(@PathVariable Long userId) {
        return paymentService.payments(userId);
    }
}
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

    
    @GetMapping("wallets")
    public PaymentDtos.WalletResponse wallet() {
        return paymentService.wallet();
    }

    @PostMapping("wallets/top-up")
    public PaymentDtos.WalletResponse topUp( @RequestBody PaymentDtos.TopUpRequest request) {
        return paymentService.topUp( request);
    }



    @GetMapping("payments/users")
    public List<PaymentDtos.PaymentResponse> payments() {
        return paymentService.payments();
    }
}
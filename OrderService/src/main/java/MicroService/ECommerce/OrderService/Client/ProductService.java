package MicroService.ECommerce.OrderService.Client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import MicroService.ECommerce.OrderService.Request.CartProduct;

@FeignClient
public interface ProductService {
    @PostMapping("/api/v1/products/getProducts")
    List<CartProduct> getProductsByIds(@RequestBody List<Long> productIds);
}

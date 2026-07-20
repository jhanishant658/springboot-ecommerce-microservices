package MicroService.ECommerce.CartService.ClientRequest;

import java.util.List;

import MicroService.ECommerce.CartService.Dto.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {
    private long userId ;
    private List<Product> products ; 
    private long totalAmount ;
}
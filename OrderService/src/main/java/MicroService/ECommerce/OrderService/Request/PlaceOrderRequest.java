package MicroService.ECommerce.OrderService.Request;

import java.util.List;
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

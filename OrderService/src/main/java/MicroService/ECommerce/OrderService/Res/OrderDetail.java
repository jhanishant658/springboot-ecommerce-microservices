package MicroService.ECommerce.OrderService.Res;

import java.time.LocalDateTime;


import java.util.List;

import MicroService.ECommerce.OrderService.Request.CartProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    private List<CartProduct> products;
    private List<Long> quantity;
    private long totalAmount ;
    private String status ;
    private LocalDateTime date ;
}
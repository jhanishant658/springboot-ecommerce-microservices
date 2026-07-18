package MicroService.ECommerce.OrderService.Model;

import java.time.LocalDateTime;
import java.util.List;

import MicroService.ECommerce.OrderService.Request.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ElementCollection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    private long userId ;
    @ElementCollection
    private List<Product> products;
    private long totalAmount ;
    private String status ;
    private LocalDateTime date ;

}

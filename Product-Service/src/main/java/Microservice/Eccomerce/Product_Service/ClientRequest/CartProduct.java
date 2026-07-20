package Microservice.Eccomerce.Product_Service.ClientRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartProduct {
    private long id ;
    private String title;
    private double rating ;
    private double price ;
    private double discountPrice;
    private String thumbnail ;
}

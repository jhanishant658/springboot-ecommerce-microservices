package Microservice.Eccomerce.Product_Service.Request;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class CreateProductRequest {
    private String title;
    private String description;
    private String category ;
    private List<String> images ;
   
    private double discountPercentage;
   
    private double rating ; 
   
    private double price ;
 
    private double discountPrice;
    private String thumbnail ;
    private long quantity;
}
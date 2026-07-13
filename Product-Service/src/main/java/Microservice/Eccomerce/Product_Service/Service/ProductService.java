package Microservice.Eccomerce.Product_Service.Service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import Microservice.Eccomerce.Product_Service.Entity.Product;
import Microservice.Eccomerce.Product_Service.Repository.ProductRepo;
import lombok.AllArgsConstructor;

/**
 * ProductService
 */
@Service
@AllArgsConstructor
public class ProductService {
    
 private final ProductRepo productRepo ;
 public Product getProductById(@NonNull  Long id) {
  return productRepo.findById(id).orElse(null);
 }
 public Product saveProduct(@NonNull  Product product) {
  return productRepo.save(product);
 }
 
 public String saveAllProducts(@NonNull  List<Product> products) {
  productRepo.saveAll(products);
  return "Products saved successfully";
 }
 


    
}
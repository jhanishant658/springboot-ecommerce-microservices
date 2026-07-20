package Microservice.Eccomerce.Product_Service.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import Microservice.Eccomerce.Product_Service.ClientRequest.CartProduct;
import Microservice.Eccomerce.Product_Service.Entity.Product;
import Microservice.Eccomerce.Product_Service.Repository.ProductRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;


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
 public Page<Product> findByCategory(String category , int page){
   Pageable pageable = PageRequest.of(page, 2);
   return productRepo.findByCategory(category, pageable);
 }
 public List<CartProduct> getCartProducts(@NonNull List<Long> productIds) {
    return productRepo.findByIdIn(productIds);
 }


    
}
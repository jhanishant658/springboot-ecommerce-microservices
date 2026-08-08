package Microservice.Eccomerce.Product_Service.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import Microservice.Eccomerce.Product_Service.Event.ProductEvent;
import Microservice.Eccomerce.Product_Service.ClientRequest.CartProduct;
import Microservice.Eccomerce.Product_Service.Entity.Product;
import Microservice.Eccomerce.Product_Service.Repository.ProductRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import Microservice.Eccomerce.Product_Service.Request.CreateProductRequest;


/**
 * ProductService
 */
@Service
@AllArgsConstructor
public class ProductService {
    
 private final ProductRepo productRepo ;
 private final KafkaTemplate<String, ProductEvent> kafkaTemplate;
 public Product getProductById(@NonNull  Long id) {
  return productRepo.findById(id).orElse(null);
 }
 public Product saveProduct(@NonNull  CreateProductRequest productRequest) {
  Product product = new Product();
  product.setTitle(productRequest.getTitle());
  product.setDescription(productRequest.getDescription());
  product.setCategory(productRequest.getCategory());
  product.setImages(productRequest.getImages());
  product.setDiscountPercentage(productRequest.getDiscountPercentage());
  product.setRating(productRequest.getRating());
  product.setPrice(productRequest.getPrice());
  product.setDiscountPrice(productRequest.getDiscountPrice());
  product.setThumbnail(productRequest.getThumbnail());

  Product savedProduct = productRepo.save(product);

  kafkaTemplate.send("product-topic", new ProductEvent(EventType.PRODUCT_CREATED, savedProduct.getId(), productRequest.getQuantity()));

  return savedProduct;
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
    List<Product> products = productRepo.findByIdIn(productIds);

return products.stream()
        .map(p -> new CartProduct(
                p.getId(),
                p.getTitle(),
                p.getRating(),
                p.getPrice(),
                p.getDiscountPrice(),
                p.getThumbnail()
        ))
        .toList();
 }
 public Page<Product> getAllProducts(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return productRepo.findAll(pageable);
 }


    
}
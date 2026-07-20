package Microservice.Eccomerce.Product_Service.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Microservice.Eccomerce.Product_Service.ClientRequest.CartProduct;
import Microservice.Eccomerce.Product_Service.Entity.Product;
import Microservice.Eccomerce.Product_Service.Service.ProductService;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/products")
@AllArgsConstructor
public class ProductController {
    private final ProductService productService ;
    @GetMapping("/{id}")
    ResponseEntity<Product> getProductById(@PathVariable @NonNull Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping()
    ResponseEntity<Product> saveProduct(@RequestBody @NonNull Product product) {
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }
    @PostMapping("saveAll")
    ResponseEntity<String> saveAllProducts(@RequestBody @NonNull java.util.List<Product> products) {
        String response = productService.saveAllProducts(products);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/category/{category}/{page}")
    ResponseEntity<Page<Product>> findByCategory(@PathVariable String category , @PathVariable int page) {
       Page<Product> products = productService.findByCategory(category, page);
        return ResponseEntity.ok(products);
    }
    @PostMapping("getProducts")
      List<CartProduct> getProductsByIds(@RequestBody @NonNull List<Long> productIds){
        return productService.getCartProducts(productIds);
      }
      @GetMapping("/all/{page}/{size}")
        ResponseEntity<Page<Product>> getAllProducts(@PathVariable int page, @PathVariable int size) {
            Page<Product> products = productService.getAllProducts(page, size);
            return ResponseEntity.ok(products);
        }
}

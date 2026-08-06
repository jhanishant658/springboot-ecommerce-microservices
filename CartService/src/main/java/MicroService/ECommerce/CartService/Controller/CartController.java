package MicroService.ECommerce.CartService.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.CartService.Dto.CartProduct;
import MicroService.ECommerce.CartService.Dto.Product;
import MicroService.ECommerce.CartService.Model.Cart;
import MicroService.ECommerce.CartService.Service.CartService;

import lombok.AllArgsConstructor;



/**
 * CartController
 */
@RestController
@RequestMapping("api/v1/cart")
@AllArgsConstructor
public class CartController {
    
    private final CartService cartService;
    @PostMapping("/addProduct")
    public ResponseEntity<Cart> addProductToCart( @RequestBody Product product) {
        Cart updatedCart = cartService.addProductToCart( product);
        return ResponseEntity.ok(updatedCart);
    }
    @PutMapping("/updateProduct")
    public ResponseEntity<Cart> updateProductInCart( @RequestBody List<Product> product) {
        Cart updatedCart = cartService.updateCart(product);
        return ResponseEntity.ok(updatedCart);
    }
    @PostMapping("getCart")
    public List<CartProduct> getCart() {
        return cartService.getProductsByCartId();
    }

   

    
}
package Microservice.Eccomerce.Product_Service.Repository;

import java.util.List;
import java.util.Optional;



import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import Microservice.Eccomerce.Product_Service.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepo extends JpaRepository< Product , Long> {

    Optional<Product> findById(@NonNull Long id);

    Page<Product> findByCategory(String category, Pageable pageable);

    List<Product> findByIdIn(List<Long> productIds);
    
    Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    Page<String> findDistinctCategories(Pageable pageable);

    Page<Product> findByCategoryAndPriceBetween(String category, double min, double max, Pageable pageable);
    Page<Product> findByCategoryAndPriceBetweenOrderByPriceAsc(String category, double min, double max, Pageable pageable);
    Page<Product> findByCategoryAndPriceBetweenOrderByPriceDesc(String category, double min, double max, Pageable pageable);
    boolean existsById(@NonNull Long id);

}

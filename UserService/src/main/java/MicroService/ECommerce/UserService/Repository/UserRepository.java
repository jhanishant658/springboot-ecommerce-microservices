package MicroService.ECommerce.UserService.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.UserService.Entity.User;

/**
 * UserRepository
 */
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserName(String userName);
    

    
}
package MicroService.ECommerce.OrderService.Service;

import org.springframework.stereotype.Service;

import MicroService.ECommerce.OrderService.Repository.OrderRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {
  private final OrderRepo orderRepo ;


    
}
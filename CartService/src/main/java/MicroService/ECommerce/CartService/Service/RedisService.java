package MicroService.ECommerce.CartService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;

import lombok.extern.slf4j.Slf4j;

/**
 * RedisService
 */
@Service
@Slf4j
public class RedisService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
public void set(String key , Object value ) {
    try{
    log.info("Setting key: {} with value: {} ", key, value);
    redisTemplate.opsForValue().set(
        key,
        value,
        Duration.ofHours(1)
);
log.info("Successfully setted in redis");
    
}
    catch(Exception e){
        log.error("Error setting key: {} with value: {} and ", key, value, e);
    }
}
public Object get(String key) {
    try{
    log.info("Getting key: {} from redis", key);
    return redisTemplate.opsForValue().get(key);
     }
    catch(Exception e){
        log.error("Error getting key: {} from redis", key, e);
        return null;
    }
} 
public void delete(String key) {
    try {
        redisTemplate.delete(key);
        log.info("Deleted key: {}", key);
    } catch (Exception e) {
        log.error("Error deleting key: {}", key, e);
    }
}
}
package MicroService.ECommerce.OrderService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;

import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * RedisService
 */
@Service
@Slf4j
public class RedisService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ObjectMapper objectMapper;
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
public <T> T get(String key, Class<T> clazz) {
    try {
        log.info("Getting key: {} from redis", key);

        Object value = redisTemplate.opsForValue().get(key);

        if (value == null) {
            return null;
        }

        return objectMapper.convertValue(value, clazz);

    } catch (Exception e) {
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
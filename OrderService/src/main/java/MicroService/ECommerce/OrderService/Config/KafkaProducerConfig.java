
package MicroService.ECommerce.OrderService.Config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.common.config.SslConfigs;
import MicroService.ECommerce.OrderService.Events.OrderPlaceEvent;


import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    
private String bootstrapServers;
@Value("${spring.kafka.properties.security.protocol}")
private String securityProtocol;

@Value("${spring.kafka.properties.ssl.keystore.location}")
private String keystoreLocation;

@Value("${spring.kafka.properties.ssl.keystore.password}")
private String keystorePassword;

@Value("${spring.kafka.properties.ssl.truststore.location}")
private String truststoreLocation;
@Value("${spring.kafka.properties.ssl.keystore.type}")
private String keystoreType;

@Value("${spring.kafka.properties.ssl.truststore.type}")
private String truststoreType;

@Value("${spring.kafka.properties.ssl.truststore.password}")
private String truststorePassword;

    @Bean
    public ProducerFactory<String, OrderPlaceEvent> producerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
        StringSerializer.class);

config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
        JsonSerializer.class);

// SSL Configuration
config.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, securityProtocol);

config.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, keystoreLocation);
config.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, keystorePassword);
config.put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, keystoreType);

config.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, truststoreLocation);
config.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, truststorePassword);
config.put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, truststoreType);

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, OrderPlaceEvent> kafkaTemplate() {

        return new KafkaTemplate<>(producerFactory());

    }
}
    

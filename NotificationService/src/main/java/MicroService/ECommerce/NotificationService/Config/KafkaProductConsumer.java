package MicroService.ECommerce.NotificationService.Config;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.config.SslConfigs;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;

import MicroService.ECommerce.NotificationService.Events.ProductEvent;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProductConsumer{

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.properties.security.protocol}")
    private String securityProtocol;

    @Value("${spring.kafka.properties.ssl.keystore.location}")
    private String keystoreLocation;

    @Value("${spring.kafka.properties.ssl.keystore.password}")
    private String keystorePassword;

    @Value("${spring.kafka.properties.ssl.keystore.type}")
    private String keystoreType;

    @Value("${spring.kafka.properties.ssl.truststore.location}")
    private String truststoreLocation;

    @Value("${spring.kafka.properties.ssl.truststore.password}")
    private String truststorePassword;

    @Value("${spring.kafka.properties.ssl.truststore.type}")
    private String truststoreType;

    @Bean
    public ConsumerFactory<String, ProductEvent> productConsumerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "product-group");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");

        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class);

        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JacksonJsonDeserializer.class);

        // SSL Configuration
        config.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, securityProtocol);

        config.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, keystoreLocation);
        config.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, keystorePassword);
        config.put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, keystoreType);

        config.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, truststoreLocation);
        config.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, truststorePassword);
        config.put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, truststoreType);

       JacksonJsonDeserializer<ProductEvent> deserializer =
        new JacksonJsonDeserializer<>(ProductEvent.class);

deserializer.addTrustedPackages("*");
deserializer.setUseTypeHeaders(false);

return new DefaultKafkaConsumerFactory<>(
        config,
        new StringDeserializer(),
        deserializer
);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductEvent> productKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, ProductEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(productConsumerFactory());

        return factory;
    }
}
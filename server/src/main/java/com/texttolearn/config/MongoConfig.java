package com.texttolearn.config;

import com.mongodb.ConnectionString;
import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.net.InetSocketAddress;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

    @Value("${MONGO_URI:${spring.data.mongodb.uri:}}")
    private String mongoUri;

    private MongoServer inMemoryServer;

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoUriCustomizer() {
        return builder -> {
            if (StringUtils.hasText(mongoUri)) {
                log.info("Connecting to external MongoDB at configured URI");
                builder.applyConnectionString(new ConnectionString(mongoUri));
            } else {
                log.info("No external MONGO_URI provided. Starting pure Java in-memory MongoDB server...");
                inMemoryServer = new MongoServer(new MemoryBackend());
                InetSocketAddress address = inMemoryServer.bind();
                String localUri = "mongodb://" + address.getHostString() + ":" + address.getPort() + "/text_to_learn";
                log.info("In-memory MongoDB ready at {}", localUri);
                builder.applyConnectionString(new ConnectionString(localUri));
            }
        };
    }

    @PreDestroy
    public void shutdown() {
        if (inMemoryServer != null) {
            inMemoryServer.shutdown();
        }
    }
}

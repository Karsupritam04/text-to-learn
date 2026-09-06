package com.texttolearn.config;

import com.mongodb.ConnectionString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class MongoConfig {

    @Value("${MONGO_URI:${spring.data.mongodb.uri:}}")
    private String mongoUri;

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoUriCustomizer() {
        return builder -> {
            if (StringUtils.hasText(mongoUri)) {
                builder.applyConnectionString(new ConnectionString(mongoUri));
            }
        };
    }
}

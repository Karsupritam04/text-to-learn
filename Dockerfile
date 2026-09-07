FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
ENV MAVEN_OPTS="-Xmx384m -XX:+UseSerialGC"
COPY server/pom.xml .
COPY server/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
EXPOSE 10000
COPY --from=build /app/target/text-to-learn-backend.jar app.jar
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -Dserver.address=0.0.0.0 -jar app.jar"]

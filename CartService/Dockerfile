FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /CartService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests
FROM eclipse-temurin:21-jre


WORKDIR /CARTSERVICE

COPY --from=build /CartService/target/CartService-0.0.1-SNAPSHOT.jar cart-service.jar
ENTRYPOINT ["java" ,"-jar" ,"cart-service.jar"]

EXPOSE 8081

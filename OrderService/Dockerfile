FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /OrderService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /OrderService

COPY --from=build /OrderService/target/OrderService-0.0.1-SNAPSHOT.jar  Notification-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Notification-service.jar"]

EXPOSE 8085

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /NotificationService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /NotificationService

COPY --from=build /NotificationService/target/NotificationService-0.0.1-SNAPSHOT.jar  Notification-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Notification-service.jar"]

EXPOSE 8084

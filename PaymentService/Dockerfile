FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /PaymentService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /PaymentService

COPY --from=build /PaymentService/target/PaymentService-0.0.1-SNAPSHOT.jar  Payment-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Payment-service.jar"]


EXPOSE 8086

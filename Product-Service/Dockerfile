FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /Product-Service

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /Product-Service

COPY --from=build /Product-Service/target/Product-Service-0.0.1-SNAPSHOT.jar  Product-service.jar

COPY --from=build /Product-Service/src/main/resources/Certs ./src/main/resources/certs

ENTRYPOINT ["java" ,"-jar" ,"Product-service.jar"]

EXPOSE 8086

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /InventoryService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /InventoryService

COPY --from=build /InventoryService/target/InventoryService-0.0.1-SNAPSHOT.jar  Inventory-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Inventory-service.jar"]

EXPOSE 8083

FROM eclipse-temurin:21-jre


WORKDIR /InventoryService

COPY  target/InventoryService-0.0.1-SNAPSHOT.jar  Inventory-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Inventory-service.jar"]

EXPOSE 8083

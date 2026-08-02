FROM eclipse-temurin:21-jre


WORKDIR /OrderService

COPY  target/OrderService-0.0.1-SNAPSHOT.jar  Order-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Order-service.jar"]

EXPOSE 8084

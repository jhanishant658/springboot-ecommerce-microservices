FROM eclipse-temurin:21-jre


WORKDIR /Product-Service

COPY  target/Product-Service-0.0.1-SNAPSHOT.jar product-service.jar

ENTRYPOINT ["java" ,"-jar" ,"product-service.jar"]

EXPOSE 8082

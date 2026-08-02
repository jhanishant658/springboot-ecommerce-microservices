FROM eclipse-temurin:21-jre


WORKDIR /CARTSERVICE

COPY  target/CartService-0.0.1-SNAPSHOT.jar cart-service.jar

ENTRYPOINT ["java" ,"-jar" ,"cart-service.jar"]

EXPOSE 8081

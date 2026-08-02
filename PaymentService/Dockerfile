FROM eclipse-temurin:21-jre


WORKDIR /PaymentService

COPY  target/PaymentService-0.0.1-SNAPSHOT.jar  Payment-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Payment-service.jar"]

EXPOSE 8086

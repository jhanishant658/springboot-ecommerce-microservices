FROM eclipse-temurin:21-jre


WORKDIR /NotificationService

COPY  target/NotificationService-0.0.1-SNAPSHOT.jar  Notification-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Notification-service.jar"]

EXPOSE 8084

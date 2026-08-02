FROM eclipse-temurin:21-jre


WORKDIR /UserService

COPY  target/UserService-0.0.1-SNAPSHOT.jar  User-service.jar

ENTRYPOINT ["java" ,"-jar" ,"User-service.jar"]

EXPOSE 8083

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /UserService

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /UserService

COPY --from=build /UserService/target/UserService-0.0.1-SNAPSHOT.jar  User-service.jar

ENTRYPOINT ["java" ,"-jar" ,"User-service.jar"]

EXPOSE 8087


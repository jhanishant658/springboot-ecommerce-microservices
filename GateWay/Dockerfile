FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /GATEWAY

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /GATEWAY

COPY --from=build /GATEWAY/target/GateWay-0.0.1-SNAPSHOT.jar gateway.jar


ENTRYPOINT ["java" ,"-jar" ,"gateway.jar"]

EXPOSE 8080

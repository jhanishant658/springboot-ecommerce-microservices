
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /service-registry

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre


WORKDIR /service-registry

COPY --from=build /service-registry/target/service-registry-0.0.1-SNAPSHOT.jar  Order-service.jar

ENTRYPOINT ["java" ,"-jar" ,"Order-service.jar"]


EXPOSE 8087

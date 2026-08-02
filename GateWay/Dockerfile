FROM eclipse-temurin:21-jre


WORKDIR /GATEWAY

COPY  target/GateWay-0.0.1-SNAPSHOT.jar gateway.jar

ENTRYPOINT ["java" ,"-jar" ,"gateway.jar"]

EXPOSE 8080

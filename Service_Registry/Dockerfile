FROM eclipse-temurin:21-jre

WORKDIR /service-registry

COPY target/Service_Registry-0.0.1-SNAPSHOT.jar service-registry.jar

ENTRYPOINT ["java", "-jar", "service-registry.jar"]
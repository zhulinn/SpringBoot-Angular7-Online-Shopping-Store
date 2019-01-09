FROM openjdk:11-oracle
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar","/app.jar", "--spring.profiles.active=docker"]

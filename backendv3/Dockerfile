# Build Stage
FROM gradle:8.5-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

# Runtime Stage
FROM openjdk:17
EXPOSE 8001
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/ktor-docker-sample.jar
COPY .env /app/.env
WORKDIR /app
ENTRYPOINT ["java", "-jar", "/app/ktor-docker-sample.jar"]

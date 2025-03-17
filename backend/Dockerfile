FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY build.sbt .
COPY project ./project
RUN sbt update

COPY . .
RUN sbt clean assembly

# Create runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/scala-*/your-app-assembly-*.jar ./app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]

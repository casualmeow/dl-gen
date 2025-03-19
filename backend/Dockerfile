FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk update && apk add curl bash && \
    curl -L https://github.com/sbt/sbt/releases/download/v1.9.9/sbt-1.9.9.tgz | tar xvz -C /usr/local && \
    ln -s /usr/local/sbt/bin/sbt /usr/local/bin/sbt

COPY build.sbt .
COPY project ./project
RUN sbt update

COPY . .
RUN sbt clean assembly

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/scala-2.13/backend.jar ./app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

import Dependencies._

ThisBuild / scalaVersion     := "2.13.12"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "com.example"
ThisBuild / organizationName := "example"

val AkkaVersion     = "2.8.5"   // Версія для actor-typed і stream
val AkkaHttpVersion = "10.5.3"  // окрема версія для akka-http

lazy val root = (project in file("."))
  .settings(
    name := "backend",
    libraryDependencies += munit % Test
  )

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-actor-typed"    % AkkaVersion,
  "com.typesafe.akka" %% "akka-stream"         % AkkaVersion,
  "com.typesafe.akka" %% "akka-http"           % AkkaHttpVersion,
  "com.typesafe.akka" %% "akka-http-testkit"   % AkkaHttpVersion % Test,
  "com.typesafe.akka" %% "akka-stream-testkit" % AkkaVersion % Test
)

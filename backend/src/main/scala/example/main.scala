package example

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer

import scala.concurrent.{Await, ExecutionContextExecutor}
import scala.concurrent.duration.Duration

object Main {

  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem = ActorSystem("my-akka-http-system")
    implicit val materializer: Materializer = Materializer(system)
    implicit val executionContext: ExecutionContextExecutor = system.dispatcher

    val route =
      path("hello") {
        get {
          complete("Hello, Akka HTTP!")
        }
      }

    val bindingFuture = Http().newServerAt("0.0.0.0", 8080).bind(route)

    println("Server online at http://localhost:8080/\nPress RETURN to stop...")
    Await.result(system.whenTerminated, Duration.Inf)
  }
}

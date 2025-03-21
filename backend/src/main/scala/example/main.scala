package example

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.{StatusCodes, Uri}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.Materializer

import scala.concurrent.{Await, ExecutionContextExecutor, Future}
import scala.concurrent.duration.Duration

object Main {

  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem = ActorSystem("my-akka-http-system")
    implicit val materializer: Materializer = Materializer(system)
    implicit val ec: ExecutionContextExecutor = system.dispatcher

    val route: Route =
      concat(
        path("hello") {
          get {
            complete("Hello, Akka HTTP!")
          }
        },
        path("api" / "upload") {
          post {
            // For example, you might accept multi-part form data
            entity(as[akka.http.scaladsl.model.Multipart.FormData]) { formData =>
              // 1) Process the incoming form data (PDF, etc.)
              val futureHash: Future[String] = processUploadedPDF(formData)

              // 2) Once done, redirect to /edit/<hash>
              onSuccess(futureHash) { hash =>
                redirect(Uri(s"/edit/$hash"), StatusCodes.SeeOther)
              }
            }
          }
        },
        // GET /edit/<hash> to show the "edit" page
        path("edit" / Segment) { hash =>
          get {
            complete(s"You are on the edit page for hash = $hash")
          }
        }
      )

    val binding = Http().newServerAt("0.0.0.0", 8080).bind(route)
    println("Server online at http://localhost:8080/")

    // Block until system terminates
    Await.result(system.whenTerminated, Duration.Inf)
  }

  /**
   * Example function that processes an uploaded PDF from form data,
   * then returns a Future hash string.
   */
  def processUploadedPDF(
    formData: akka.http.scaladsl.model.Multipart.FormData
  )(implicit ec: ExecutionContextExecutor): Future[String] = {

    // Parse the form data, store the PDF, etc.
    // For example, you might do something like:
    // formData.parts.runFoldAsync(...) { ... }

    // For now, pretend we return a random hash after “processing”
    Future.successful(java.util.UUID.randomUUID().toString.take(8))
  }
}

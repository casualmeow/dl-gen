package example

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.{StatusCodes, Uri}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.Materializer
import akka.stream.scaladsl.FileIO
import java.io.File
import scala.concurrent.{Await, ExecutionContext, ExecutionContextExecutor, Future}
import scala.concurrent.duration.Duration
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import spray.json.DefaultJsonProtocol._


object Main {
  val adminHash = java.util.UUID.randomUUID().toString().take(12)
  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem = ActorSystem("my-akka-http-system")
    implicit val materializer: Materializer = Materializer(system)
    implicit val ec: ExecutionContextExecutor = system.dispatcher

    case class UploadResponse(url: String)
    implicit val uploadResponseFormat = jsonFormat1(UploadResponse)

    val authorizedIps = scala.collection.concurrent.TrieMap.empty[String, Boolean]
    
    val route: Route =
      concat(
        path("ping") {
          get {
            complete("pong")
          }
        },
        path("upload") {
          post {
            entity(as[akka.http.scaladsl.model.Multipart.FormData]) { formData =>
              val futureHash: Future[String] = storePdf(formData)

              onSuccess(futureHash) { hash =>
                complete(UploadResponse(s"/edit/$hash"))
              }
            }
          }
        },
        path("files" / Segment) { hash =>
          get {
            val pdfFile = new File(s"/app/pdfs/$hash.pdf")
            if (pdfFile.exists()) {
              getFromFile(pdfFile)
            } else {
              complete(StatusCodes.NotFound, "PDF not found.")
            }
          }
        }   
      )

    val binding = Http().newServerAt("0.0.0.0", 8080).bind(route)
    println("Server online at http://localhost:8080/")
    Await.result(system.whenTerminated, Duration.Inf)
  }

  def storePdf(formData: akka.http.scaladsl.model.Multipart.FormData)(implicit ec: ExecutionContext, materializer: Materializer): Future[String] = {
    val hash = java.util.UUID.randomUUID().toString.take(8)
    val pdfDirectory = "/app/pdfs"
    val outFile = new File(s"$pdfDirectory/$hash.pdf")

    formData.parts
      .runFoldAsync(false) { case (done, part) =>
        if (part.filename.isDefined) {
        val fileSink = FileIO.toPath(outFile.toPath)
        part.entity.dataBytes.runWith(fileSink).map(_ => done)
      } else {
        Future.successful(done)
      }
    }
    .map { _ => hash }
}

}

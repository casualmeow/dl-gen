package example

import scala.collection.concurrent.TrieMap
import akka.http.scaladsl.model.RemoteAddress

object AdminAuthorizer {
  val adminHash: String = java.util.UUID.randomUUID().toString.take(12)
  
  private val authorizedIps = TrieMap.empty[String, Boolean]
  
  def isAuthorized(ip: RemoteAddress): Boolean =
    ip.toOption
      .map(_.getHostAddress)
      .exists(ipAddress => authorizedIps.getOrElse(ipAddress, false))
  
  def authorize(ip: RemoteAddress, providedHash: String): Boolean =
    ip.toOption.map(_.getHostAddress) match {
      case Some(ipAddress) if providedHash == adminHash =>
        authorizedIps.put(ipAddress, true)
        true
      case _ => false
    }
}

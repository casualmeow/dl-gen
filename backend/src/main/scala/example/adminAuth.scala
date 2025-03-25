package example

import scala.collection.concurrent.TrieMap
import akka.http.scaladsl.model.RemoteAddress

object AdminAuthorizer {
  // Ключ генерируется один раз при запуске
  val adminHash: String = java.util.UUID.randomUUID().toString.take(12)
  
  // Потокобезопасная мапа для авторизации IP
  private val authorizedIps = TrieMap.empty[String, Boolean]
  
  // Проверка авторизации IP
  def isAuthorized(ip: RemoteAddress): Boolean =
    ip.toOption
      .map(_.getHostAddress)
      .exists(ipAddress => authorizedIps.getOrElse(ipAddress, false))
  
  // Авторизация IP с помощью hash
  def authorize(ip: RemoteAddress, providedHash: String): Boolean =
    ip.toOption.map(_.getHostAddress) match {
      case Some(ipAddress) if providedHash == adminHash =>
        authorizedIps.put(ipAddress, true)
        true
      case _ => false
    }
}

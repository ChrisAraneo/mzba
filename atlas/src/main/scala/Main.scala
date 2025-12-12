import org.apache.pekko.actor.ActorSystem
import org.apache.pekko.http.scaladsl.Http
import org.apache.pekko.http.scaladsl.model.ws.{Message, TextMessage}
import org.apache.pekko.http.scaladsl.server.Directives._
import org.apache.pekko.stream.scaladsl.Flow

import scala.concurrent.ExecutionContextExecutor
import scala.io.StdIn

object Main extends App {
  implicit val system: ActorSystem = ActorSystem()
  implicit val executionContext: ExecutionContextExecutor = system.dispatcher

  val websocketFlow: Flow[Message, Message, Any] = Flow[Message].map {
    case TextMessage.Strict(text) =>
      val response = if (text == "hi") "hello" else s"Echo: $text"
      TextMessage(response)
    case _ => TextMessage("Unsupported message type")
  }

  val route =
    path("ws") {
      get {
        handleWebSocketMessages(websocketFlow)
      }
    }

  val bindingFuture = Http().newServerAt("localhost", 8080).bind(route)

  println("WebSocket server started at ws://localhost:8080/ws")
  println("Send 'hi' to receive 'hello' response")
  println("Press ENTER to stop...")

  StdIn.readLine()
  
  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}

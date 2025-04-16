package com.example.routing

import com.example.models.dtos.BasicUser
import com.example.repositories.UserRepository
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.userRouting(userRepository: UserRepository) {
    authenticate {
        route("/users") {
        get("/{id}") {
            val id =
                call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing id")
            val user = userRepository.getDetailedUserById(id)
            if (user != null) {
                call.respond(user)
            } else {
                call.respond(HttpStatusCode.NotFound, "Not found")
            }
        }
        get("/all") {
            call.respond(HttpStatusCode.OK, userRepository.getAll())
        }
        post("/create") {
            val user = call.receive<BasicUser>()
            call.respond(HttpStatusCode.Created, userRepository.createAndGetId(user))
        }

        put("/update/{id}") {
            val id =
                call.parameters["id"]?.toIntOrNull() ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing id")
            val user = call.receive<BasicUser>()
            userRepository.update(id, user)
            call.respond(HttpStatusCode.NoContent)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(
                HttpStatusCode.BadRequest,
                "Missing id"
            )
            if (userRepository.delete(id)) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
            }
        }
    }
}
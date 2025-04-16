package com.example.routing

import com.example.models.dtos.BasicWork
import com.example.repositories.WorkRepository
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.workRouting(workRepository: WorkRepository) {
    route("/works") {
        get("/{id}") {
            val id =
                call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing id")

            val work = workRepository.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, "Not found")
            call.respond(work)
        }

        get("/all") {
            call.respond(workRepository.getAll())
        }

        post("/create") {
            val work = call.receive<BasicWork>()
            call.respond(HttpStatusCode.Created, workRepository.createAndGetId(work))
        }

        put("/update/{id}") {
            val id =
                call.parameters["id"]?.toIntOrNull() ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing id")

            val work = call.receive<BasicWork>()
            workRepository.update(id, work)
            call.respond(HttpStatusCode.NoContent)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(
                HttpStatusCode.BadRequest,
                "Missing id"
            )
            if (workRepository.delete(id)) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}
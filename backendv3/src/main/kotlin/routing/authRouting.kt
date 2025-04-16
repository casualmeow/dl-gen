package com.example.routing

import com.example.auth.AuthService
import com.example.models.dtos.LoginRequest
import com.example.models.dtos.RegisterRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.authRouting(authService: AuthService) {
    route("/auth") {
        post("/register") {
            try {
                val registerRequest = call.receive<RegisterRequest>()
                val user = authService.register(registerRequest)
                call.respond(HttpStatusCode.Created, user)
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.Conflict, mapOf("error" to e.message))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "An unexpected error occurred"))
            }
        }
        post("/login") {
            try {
                val loginRequest = call.receive<LoginRequest>()
                val tokenResponse = authService.login(loginRequest)
                
                if (tokenResponse != null) {
                    call.respond(HttpStatusCode.OK, tokenResponse)
                } else {
                    call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid credentials"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "An unexpected error occurred"))
            }
        }
        authenticate {
            get("/me") {
                val principal = call.principal<JWTPrincipal>()
                val userId = principal?.payload?.getClaim("userId")?.asInt()
                
                if (userId != null) {
                    val user = authService.getUserById(userId)
                    if (user != null) {
                        call.respond(HttpStatusCode.OK, user)
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "User not found"))
                    }
                } else {
                    call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid token"))
                }
            }
        }
    }
}
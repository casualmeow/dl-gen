package com.example.routing

import com.example.auth.AuthService
import com.example.repositories.UserRepository
import com.example.repositories.WorkRepository
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    val userRepository by inject<UserRepository>()
    val workRepository by inject<WorkRepository>()
    val authService by inject<AuthService>()
    
    routing {
        get("/ping") {
            call.respondText("Ktor server works")
        }
        authRouting(authService)
        userRouting(userRepository)
        workRouting(workRepository)
    }
}

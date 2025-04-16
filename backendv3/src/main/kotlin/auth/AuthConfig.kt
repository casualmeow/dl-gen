package com.example.auth

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*

fun Application.configureAuthentication(jwtService: JwtService) {
    install(Authentication) {
        jwt {
            val config = jwtService.configureJwtAuthentication()
            realm = config.realm
            verifier(config.verifier)
            validate { credential -> 
                config.validate(credential)
            }
        }
    }
}
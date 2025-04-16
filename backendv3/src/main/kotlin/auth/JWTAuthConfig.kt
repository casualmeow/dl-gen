package com.example.auth

import com.auth0.jwt.JWTVerifier
import io.ktor.server.auth.jwt.*

/**
 * Custom configuration class for JWT authentication
 * This replaces the use of JWTAuthenticationProvider.Configuration which is not available in the current Ktor version
 */
data class JWTAuthConfig(
    val realm: String,
    val verifier: JWTVerifier,
    val validate: (JWTCredential) -> JWTPrincipal?
)
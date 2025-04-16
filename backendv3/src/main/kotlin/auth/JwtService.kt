package com.example.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import io.ktor.server.auth.jwt.*
import java.util.*
import java.util.concurrent.TimeUnit

class JwtService(private val application: Application) {
    private val jwtSecret = application.environment.config.property("jwt.secret").getString()
    private val jwtIssuer = application.environment.config.property("jwt.issuer").getString()
    private val jwtAudience = application.environment.config.property("jwt.audience").getString()
    private val jwtRealm = application.environment.config.property("jwt.realm").getString()

    private val expirationInMillis = TimeUnit.HOURS.toMillis(24)

    fun generateToken(userId: Int, email: String): String {
        return JWT.create()
            .withSubject("Authentication")
            .withIssuer(jwtIssuer)
            .withAudience(jwtAudience)
            .withClaim("userId", userId)
            .withClaim("email", email)
            .withExpiresAt(Date(System.currentTimeMillis() + expirationInMillis))
            .sign(Algorithm.HMAC256(jwtSecret))
    }

    fun configureJwtAuthentication(): JWTAuthConfig {
        val jwtVerifier = JWT
            .require(Algorithm.HMAC256(jwtSecret))
            .withAudience(jwtAudience)
            .withIssuer(jwtIssuer)
            .build()
            
        return JWTAuthConfig(
            realm = jwtRealm,
            verifier = jwtVerifier,
            validate = { credential ->
                if (credential.payload.getClaim("userId").asInt() != 0) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        )
    }
}
package com.example.models.dtos

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

@Serializable
data class TokenResponse(
    val token: String,
    // @SerialName("user_id")
    val userId: Int,
    val email: String,
    val name: String
)

@Serializable
data class UserResponse(
    val id: Int,
    val name: String,
    val email: String
)
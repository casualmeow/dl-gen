package com.example.models.dtos

import kotlinx.serialization.Serializable

@Serializable
data class BasicUser(
    val id: Int? = null,
    val name: String,
    val email: String,
    val password: String
)
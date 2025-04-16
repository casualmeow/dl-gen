package com.example.models.dtos

import kotlinx.serialization.Serializable

@Serializable
data class DetailedUser(
    val id: Int? = null,
    val name: String,
    val email: String,
    val password: String,
    val works: List<BasicWork>
)

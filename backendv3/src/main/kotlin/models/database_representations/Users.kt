package com.example.models.database_representations

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable("users") {
    val name = varchar("name", 50)
    val email = varchar("email", 50)
    val password = varchar("password", 50)
}
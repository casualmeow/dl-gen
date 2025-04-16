package com.example.db

import io.github.cdimascio.dotenv.dotenv
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database


fun Application.configureDatabase() {
    val dotenv = dotenv {
        ignoreIfMalformed = true
        ignoreIfMissing = true
    }

    val dbUrl = dotenv["DB_URL"]
    val dbUser = dotenv["DB_USER"]
    val dbPassword = dotenv["DB_PASSWORD"]

    Database.connect(
        url = dbUrl,
        driver = "org.postgresql.Driver",
        user = dbUser,
        password = dbPassword
    )
}

package com.example

import com.example.auth.JwtService
import com.example.auth.configureAuthentication
import com.example.db.configureDatabase
import com.example.db.configureTables
import com.example.routing.configureRouting
import io.ktor.server.application.*
import org.koin.ktor.ext.inject
import java.util.TimeZone

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
    configureSerialization()
    configureDatabase()
    configureTables()
    configureFrameworks()
    val jwtService by inject<JwtService>()
    configureAuthentication(jwtService)
    configureRouting()
}

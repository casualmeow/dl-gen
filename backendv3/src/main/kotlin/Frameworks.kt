package com.example

import com.example.di.appModule
import io.ktor.server.application.*
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureFrameworks() {
    install(Koin) {
        slf4jLogger()
        // Provide the Application instance to the Koin container
        modules(module { single { this@configureFrameworks } }, appModule)
    }
}

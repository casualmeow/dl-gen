package com.example.di

import com.example.auth.AuthService
import com.example.auth.JwtService
import com.example.repositories.UserRepository
import com.example.repositories.WorkRepository
import io.ktor.server.application.*
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

val appModule = module {
    singleOf(::UserRepository)
    singleOf(::WorkRepository)
    
    // Register JwtService as a singleton with the Application instance
    single { JwtService(get()) }
    single { AuthService(get(), get()) }
}
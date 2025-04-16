package com.example.db

import com.example.models.database_representations.Users
import com.example.models.database_representations.Works
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun configureTables() {
    try {
        transaction {
            val tables = listOf(Users, Works)
            SchemaUtils.createMissingTablesAndColumns(*tables.toTypedArray())
            println("Successfully created tables: ${tables.joinToString { it.tableName }}")
        }
    } catch (e: Exception) {
        // Log the error but don't fail the application startup
        println("Warning: Error during table creation: ${e.message}")
        e.printStackTrace()
    }
}
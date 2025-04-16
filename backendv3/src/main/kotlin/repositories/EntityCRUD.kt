package com.example.repositories

interface EntityCRUD<T> {
    fun createAndGetId(entity: T): Int

    fun getAll(): List<T>

    fun getById(id: Int): T?

    fun update(id: Int, entity: T)

    fun delete(id: Int): Boolean
}
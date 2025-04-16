package com.example.repositories

import com.example.models.dtos.BasicUser
import com.example.models.dtos.DetailedUser
import com.example.models.entities.UserEntity
import com.example.models.entities.toBasicUser
import com.example.models.entities.toDetailedUser
import org.jetbrains.exposed.sql.transactions.transaction

class UserRepository : EntityCRUD<BasicUser> {
    override fun createAndGetId(entity: BasicUser): Int {
        return transaction {
            UserEntity.new {
                name = entity.name
                email = entity.email
                password = entity.password
            }.id.value
        }
    }

    override fun getAll(): List<BasicUser> {
        return transaction {
            UserEntity.all().map { it.toBasicUser() }
        }
    }

    override fun getById(id: Int): BasicUser? {
        return transaction { UserEntity.findById(id)?.toBasicUser() }
    }

    fun getDetailedUserById(id: Int): DetailedUser? {
        return transaction {
            UserEntity.findById(id)?.toDetailedUser()
        }
    }

    override fun update(id: Int, entity: BasicUser) {
        transaction {
            UserEntity.findById(id)?.apply {
                name = entity.name
                email = entity.email
                password = entity.password
            }
        }
    }

    override fun delete(id: Int): Boolean {
        return transaction {
            UserEntity.findById(id)?.let {
                it.delete()
                true
            } == true
        }
    }
}
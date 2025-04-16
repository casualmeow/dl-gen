package com.example.models.entities

import com.example.models.database_representations.Users
import com.example.models.database_representations.Works
import com.example.models.dtos.BasicUser
import com.example.models.dtos.DetailedUser
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class UserEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserEntity>(Users)

    var name by Users.name
    var email by Users.email
    var password by Users.password

    val works by WorkEntity.referrersOn(Works.user)
}

fun UserEntity.toBasicUser(): BasicUser {
    return BasicUser(
        id = this.id.value,
        name = this.name,
        email = this.email,
        password = this.password,
    )
}

fun UserEntity.toDetailedUser(): DetailedUser {
    return DetailedUser(
        id = this.id.value,
        name = this.name,
        email = this.email,
        password = this.password,
        works = this.works.toList().map { it.toBasicWork() }
    )
}
package com.example.models.database_representations

import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ReferenceOption

enum class Status {
    PENDING, EDITED, DONE
}

object Works : IntIdTable("works") {
    val filename = varchar("file_name", 50)
    val workName = varchar("work_name", 50)
    val filePassword = varchar("file_password", 50).nullable()
    val link = varchar("link", 50)
    val status = enumerationByName("status", 10, Status::class)
    val renderingHtml = enumerationByName("rendering_html", 10, Status::class).nullable()
    val user: Column<EntityID<Int>> = reference("user_id", Users, onDelete = ReferenceOption.CASCADE)
}
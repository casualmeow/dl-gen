package com.example.models.entities

import com.example.models.database_representations.Works
import com.example.models.dtos.BasicWork
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class WorkEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<WorkEntity>(Works)

    var fileName by Works.filename
    var workName by Works.workName
    var filePassword by Works.filePassword
    var link by Works.link
    var status by Works.status
    var renderingHtml by Works.renderingHtml
    var user by UserEntity referencedOn Works.user
}

fun WorkEntity.toBasicWork(): BasicWork {
    return BasicWork(
        id = this.id.value,
        fileName = this.fileName,
        workName = this.workName,
        filePassword = this.filePassword,
        link = this.link,
        status = this.status,
        renderingHtml = this.renderingHtml,
        userId = this.id.value
    )
}

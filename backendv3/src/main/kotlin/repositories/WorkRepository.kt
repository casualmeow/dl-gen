package com.example.repositories

import com.example.models.dtos.BasicWork
import com.example.models.entities.UserEntity
import com.example.models.entities.WorkEntity
import com.example.models.entities.toBasicWork
import org.jetbrains.exposed.sql.transactions.transaction

class WorkRepository : EntityCRUD<BasicWork> {
    override fun createAndGetId(entity: BasicWork): Int {
        return transaction {
            val user = UserEntity.findById(entity.userId) ?: return@transaction -1
            WorkEntity.new {
                fileName = entity.fileName
                workName = entity.workName
                filePassword = entity.filePassword
                link = entity.link
                status = entity.status
                renderingHtml = entity.renderingHtml
                this.user = user
            }.id.value
        }
    }

    override fun getAll(): List<BasicWork> {
        return transaction {
            WorkEntity.all().map { workEntity -> workEntity.toBasicWork() }
        }
    }

    override fun getById(id: Int): BasicWork? {
        return transaction { WorkEntity.findById(id)?.toBasicWork() }
    }

    override fun update(id: Int, entity: BasicWork) {
        transaction {
            val user = UserEntity.findById(id) ?: return@transaction -1
            WorkEntity.findById(id)?.apply {
                fileName = entity.fileName
                workName = entity.workName
                filePassword = entity.filePassword
                link = entity.link
                status = entity.status
                renderingHtml = entity.renderingHtml
                this.user = user
            }
        }
    }

    override fun delete(id: Int): Boolean {
        return transaction {
            WorkEntity.findById(id)?.let {
                it.delete()
                true
            } == true
        }
    }
}
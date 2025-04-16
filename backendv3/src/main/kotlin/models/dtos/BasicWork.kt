package com.example.models.dtos

import com.example.models.database_representations.Status
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class BasicWork(
    val id: Int? = null,
    @SerialName("file_name")
    val fileName: String,
    @SerialName("work_name")
    val workName: String,
    @SerialName("file_password")
    val filePassword: String?,
    val link: String,
    val status: Status,
    val renderingHtml: Status?,
    @SerialName("user_id")
    val userId: Int
)

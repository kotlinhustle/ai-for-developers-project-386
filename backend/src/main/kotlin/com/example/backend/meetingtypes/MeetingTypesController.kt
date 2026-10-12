package com.example.backend.meetingtypes

import com.example.backend.api.MeetingTypesApi
import com.example.backend.api.model.MeetingType
import com.example.backend.api.model.MeetingTypeCreate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class MeetingTypesController(
    private val repository: MeetingTypeRepository,
) : MeetingTypesApi {
    override fun meetingTypesList(): ResponseEntity<List<MeetingType>> =
        ResponseEntity.ok(repository.findAll().map(MeetingTypeEntity::toApiModel))

    override fun meetingTypesCreate(meetingTypeCreate: MeetingTypeCreate): ResponseEntity<MeetingType> {
        val saved =
            repository.save(
                MeetingTypeEntity(
                    id = UUID.randomUUID(),
                    name = meetingTypeCreate.name,
                    description = meetingTypeCreate.description,
                    durationMinutes = meetingTypeCreate.durationMinutes,
                ),
            )

        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toApiModel())
    }
}

private fun MeetingTypeEntity.toApiModel(): MeetingType =
    MeetingType(
        id = id.toString(),
        name = name,
        description = description,
        durationMinutes = durationMinutes,
    )

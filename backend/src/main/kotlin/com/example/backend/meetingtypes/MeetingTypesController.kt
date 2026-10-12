package com.example.backend.meetingtypes

import com.example.backend.api.MeetingTypesApi
import com.example.backend.api.model.MeetingType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class MeetingTypesController : MeetingTypesApi {
    override fun meetingTypesList(): ResponseEntity<List<MeetingType>> = ResponseEntity.ok(emptyList())
}

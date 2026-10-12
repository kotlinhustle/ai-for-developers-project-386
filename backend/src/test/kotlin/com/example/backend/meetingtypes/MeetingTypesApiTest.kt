package com.example.backend.meetingtypes

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.web.client.RestClient

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MeetingTypesApiTest {
    @Value("\${local.server.port}")
    private var port: Int = 0

    @Test
    fun `GET meeting-types returns an empty list`() {
        val response =
            RestClient
                .create()
                .get()
                .uri("http://localhost:$port/meeting-types")
                .retrieve()
                .toEntity(String::class.java)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("[]", response.body)
    }
}

package com.example.backend.meetingtypes

import com.example.backend.support.PostgresTestSupport
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MeetingTypesApiTest : PostgresTestSupport() {
    @Value("\${local.server.port}")
    private var port: Int = 0

    private val rest = RestClient.create()

    @BeforeEach
    fun cleanDatabase() {
        repository.deleteAll()
    }

    @Autowired
    private lateinit var repository: MeetingTypeRepository

    @Test
    fun `GET meeting-types returns an empty list`() {
        val response = get()

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("[]", response.body)
    }

    @Test
    fun `POST meeting-types creates a type and GET lists it`() {
        val created = post("""{"name":"Консультация","description":"Разбор задачи","durationMinutes":30}""")

        assertEquals(HttpStatus.CREATED, created.statusCode)
        assertTrue(created.body!!.contains("\"name\":\"Консультация\""))
        assertTrue(created.body!!.contains("\"durationMinutes\":30"))

        val listed = get()
        assertTrue(listed.body!!.contains("\"name\":\"Консультация\""))
    }

    @Test
    fun `POST meeting-types rejects an empty name with 422`() {
        val exception =
            assertThrows<RestClientResponseException> {
                post("""{"name":"","description":"Разбор","durationMinutes":30}""")
            }

        assertEquals(422, exception.statusCode.value())
    }

    @Test
    fun `POST meeting-types rejects a non-positive duration with 422`() {
        val exception =
            assertThrows<RestClientResponseException> {
                post("""{"name":"Консультация","description":"Разбор","durationMinutes":0}""")
            }

        assertEquals(422, exception.statusCode.value())
    }

    private fun get() =
        rest
            .get()
            .uri("http://localhost:$port/meeting-types")
            .retrieve()
            .toEntity(String::class.java)

    private fun post(body: String) =
        rest
            .post()
            .uri("http://localhost:$port/meeting-types")
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .toEntity(String::class.java)
}

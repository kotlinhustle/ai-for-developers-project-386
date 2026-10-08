package com.example.backend

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.web.client.RestClient

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HealthSmokeTest {
    @Value("\${local.server.port}")
    private var port: Int = 0

    @Test
    fun `health endpoint reports UP`() {
        val response =
            RestClient
                .create()
                .get()
                .uri("http://localhost:$port/actuator/health")
                .retrieve()
                .toEntity(String::class.java)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertTrue(response.body?.contains("\"status\":\"UP\"") == true, "Body was: ${response.body}")
    }
}

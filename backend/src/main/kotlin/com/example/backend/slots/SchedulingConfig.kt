package com.example.backend.slots

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.ZoneId

@Configuration
class SchedulingConfig {
    @Bean
    fun ownerSettings(): OwnerSettings = OwnerSettings(zoneId = "Asia/Yerevan", workingHours = WorkingHours.weekdays9to18)

    @Bean
    fun slotCalculator(ownerSettings: OwnerSettings): SlotCalculator =
        SlotCalculator(ownerSettings.workingHours, ZoneId.of(ownerSettings.zoneId))
}

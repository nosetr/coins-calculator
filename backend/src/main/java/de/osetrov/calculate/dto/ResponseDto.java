package de.osetrov.calculate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.Map;

@Builder
public record ResponseDto(
    @Schema(description = "neuer Betrag", example = "220.50")
    BigDecimal newAmount,
    @Schema(description = "alter Betrag", example = "45.32")
    BigDecimal oldAmount,
    @Schema(
        description = "Die optimale Stückelung des neuen Betrags",
        example = "{\"200.00\": 1, \"20.00\": 1, \"0.50\": 1}"
    )
    Map<String, Integer> newDenomination,
    @Schema(
        description = "Die Differenz der Stückelung im Vergleich zum alten Betrag",
        example = "{\"20.00\": 1, \"0.50\": -1}"
    )
    Map<String, Integer> difference
) {
}

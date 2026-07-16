package de.osetrov.calculate.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.Map;

@Builder
public record ResponseDto(
    BigDecimal newAmount,
    BigDecimal oldAmount,
    Map<BigDecimal, Integer> newDenomination,
    Map<BigDecimal, Integer> difference
) {
}

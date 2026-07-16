package de.osetrov.calculate.service;

import de.osetrov.calculate.dto.ResponseDto;
import de.osetrov.calculate.enums.EuroDenomination;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
public class CalculatorService {
  public ResponseDto calculate(BigDecimal newAmount, BigDecimal oldAmount) {
    log.debug("[CALCULATOR_SERVICE] -> Start calculation: newAmount={}, oldAmount={}", newAmount, oldAmount);
    Map<BigDecimal, Integer> newAmountMap = buildMap(newAmount);
    Map<BigDecimal, Integer> oldAmountMap = buildMap(oldAmount);

    Map<BigDecimal, Integer> newDenominationsMap = new LinkedHashMap<>();
    Map<BigDecimal, Integer> differenceMap = new LinkedHashMap<>();

    buildFormatedMaps(newAmountMap, oldAmountMap, newDenominationsMap, differenceMap);

    return ResponseDto.builder()
        .newAmount(newAmount)
        .oldAmount(oldAmount)
        .newDenomination(newDenominationsMap)
        .difference(differenceMap)
        .build();
  }

  /**
   * Formatiert die Maps für die Ausgabe
   */
  private void buildFormatedMaps(Map<BigDecimal, Integer> newAmountMap, Map<BigDecimal, Integer> oldAmountMap,
      Map<BigDecimal, Integer> newDenominationsMap, Map<BigDecimal, Integer> differenceMap) {
    for (EuroDenomination euroDenomination : EuroDenomination.values()) {
      BigDecimal value = euroDenomination.getValue();

      int newCount = newAmountMap.getOrDefault(value, 0);
      int oldCount = oldAmountMap.getOrDefault(value, 0);
      int diff = newCount - oldCount;
      if (newCount > 0) {
        newDenominationsMap.put(value, newCount);
      }
      differenceMap.put(value, diff);
    }
  }

  /**
   * Berechnet Stückelungen
   */
  private Map<BigDecimal, Integer> buildMap(BigDecimal amount) {
    BigDecimal rest = amount;
    Map<BigDecimal, Integer> map = new LinkedHashMap<>();

    for (EuroDenomination euroDenomination : EuroDenomination.values()) {
      if (rest.compareTo(BigDecimal.ZERO) <= 0) {
        break;
      }

      BigDecimal denominationValue = euroDenomination.getValue();

      BigDecimal[] result = rest.divideAndRemainder(denominationValue);
      int index = result[0].intValue();

      if (index > 0) {
        map.put(denominationValue, index);
        rest = result[1].setScale(2, RoundingMode.HALF_UP);
      }
    }
    return map;
  }
}

package de.osetrov.calculate.service;

import de.osetrov.calculate.dto.ResponseDto;
import de.osetrov.calculate.enums.EuroDenominationEnum;
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
    boolean hasOldAmount = oldAmount != null && oldAmount.compareTo(BigDecimal.ZERO) > 0;

    Map<String, Integer> newAmountMap = buildMap(newAmount);
    Map<String, Integer> oldAmountMap = hasOldAmount ? buildMap(oldAmount) : new LinkedHashMap<>();

    Map<String, Integer> newDenominationsMap = new LinkedHashMap<>();
    Map<String, Integer> differenceMap = hasOldAmount ? new LinkedHashMap<>() : null;

    buildFormatedMaps(newAmountMap, oldAmountMap, newDenominationsMap, differenceMap, hasOldAmount);

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
  private void buildFormatedMaps(Map<String, Integer> newAmountMap, Map<String, Integer> oldAmountMap,
      Map<String, Integer> newDenominationsMap, Map<String, Integer> differenceMap, boolean hasOldAmount) {

    for (EuroDenominationEnum euroDenominationEnum : EuroDenominationEnum.values()) {
      String value = euroDenominationEnum.getValue().toString();

      int newCount = newAmountMap.getOrDefault(value, 0);
      if (newCount > 0) {
        newDenominationsMap.put(value, newCount);
      }
      if (hasOldAmount) {
        int oldCount = oldAmountMap.getOrDefault(value, 0);
        int diff = newCount - oldCount;
        if (diff != 0 || newCount > 0) {
          differenceMap.put(value, diff);
        }
      }
    }
  }

  /**
   * Berechnet Stückelungen
   */
  private Map<String, Integer> buildMap(BigDecimal amount) {
    BigDecimal rest = amount;
    Map<String, Integer> map = new LinkedHashMap<>();

    for (EuroDenominationEnum euroDenominationEnum : EuroDenominationEnum.values()) {
      if (rest.compareTo(BigDecimal.ZERO) <= 0) {
        break;
      }

      BigDecimal denominationValue = euroDenominationEnum.getValue();

      BigDecimal[] result = rest.divideAndRemainder(denominationValue);
      int index = result[0].intValue();

      if (index > 0) {
        map.put(denominationValue.toString(), index);
        rest = result[1].setScale(2, RoundingMode.HALF_UP);
      }
    }
    return map;
  }
}

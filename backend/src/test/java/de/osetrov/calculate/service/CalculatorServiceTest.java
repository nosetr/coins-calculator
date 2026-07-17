package de.osetrov.calculate.service;

import de.osetrov.calculate.dto.ResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CalculatorServiceTest {

  private CalculatorService calculatorService;

  @BeforeEach
  void setUp() {
    calculatorService = new CalculatorService();
  }

  @Test
  void calculate_ShouldReturnCorrectResult() {
    BigDecimal newAmount = new BigDecimal("234.23");
    BigDecimal oldAmount = new BigDecimal("45.32");
    ResponseDto response = calculatorService.calculate(newAmount, oldAmount);
    assertEquals(newAmount, response.newAmount());
    assertEquals(oldAmount, response.oldAmount());

    Map<String, Integer> expectedDenomination = Map.of(
        "200.00", 1,
        "20.00", 1,
        "10.00", 1,
        "2.00", 2,
        "0.20", 1,
        "0.02", 1,
        "0.01", 1
    );

    assertEquals(expectedDenomination, response.newDenomination());

    Map<String, Integer> expectedDifference = Map.of(
        "200.00", 1,
        "20.00", -1,
        "10.00", 1,
        "5.00", -1,
        "2.00", 2,
        "0.20", 0,
        "0.10", -1,
        "0.02", 0,
        "0.01", 1
    );

    assertEquals(expectedDifference, response.difference());
  }

  @Test
  void calculate_WithZeroOldAmount_ShouldReturnCorrectResultWithoutDifference() {
    BigDecimal newAmount = new BigDecimal("234.23");
    BigDecimal oldAmount = BigDecimal.ZERO;
    ResponseDto response = calculatorService.calculate(newAmount, oldAmount);
    assertEquals(newAmount, response.newAmount());
    assertEquals(oldAmount, response.oldAmount());

    Map<String, Integer> expectedDenomination = Map.of(
        "200.00", 1,
        "20.00", 1,
        "10.00", 1,
        "2.00", 2,
        "0.20", 1,
        "0.02", 1,
        "0.01", 1
    );
    assertEquals(expectedDenomination, response.newDenomination());
    assertNull(response.difference());
  }

  @Test
  void calculate_WithNullOldAmount_ShouldReturnCorrectResultWithoutDifference() {
    BigDecimal newAmount = new BigDecimal("100.00");

    ResponseDto response = calculatorService.calculate(newAmount, null);

    assertEquals(newAmount, response.newAmount());
    assertNull(response.oldAmount());

    Map<String, Integer> expectedDenomination = Map.of("100.00", 1);
    assertEquals(expectedDenomination, response.newDenomination());
    assertNull(response.difference());
  }

  @Test
  void calculate_WithZeroNewAmountAndWithZeroOldAmount_ShouldReturnEmptyDenominationWithoutDifference() {
    BigDecimal newAmount = new BigDecimal("0.00");
    BigDecimal oldAmount = BigDecimal.ZERO;

    ResponseDto response = calculatorService.calculate(newAmount, oldAmount);

    assertEquals(newAmount, response.newAmount());
    assertEquals(oldAmount, response.oldAmount());

    assertTrue(response.newDenomination().isEmpty());
    assertNull(response.difference());
  }

  @Test
  void calculate_WithZeroNewAmount_ShouldReturnEmptyDenominationWithDifference() {
    BigDecimal newAmount = new BigDecimal("0.00");
    BigDecimal oldAmount = new BigDecimal("100.00");

    ResponseDto response = calculatorService.calculate(newAmount, oldAmount);

    assertEquals(newAmount, response.newAmount());
    assertEquals(oldAmount, response.oldAmount());

    Map<String, Integer> expectedDifference = Map.of("100.00", -1);
    assertTrue(response.newDenomination().isEmpty());
    assertEquals(expectedDifference, response.difference());
  }
}
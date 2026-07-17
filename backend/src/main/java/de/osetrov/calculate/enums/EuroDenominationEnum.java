package de.osetrov.calculate.enums;

import lombok.Getter;

import java.math.BigDecimal;

public enum EuroDenominationEnum {
  EURO_200("200.00"),
  EURO_100("100.00"),
  EURO_50("50.00"),
  EURO_20("20.00"),
  EURO_10("10.00"),
  EURO_5("5.00"),
  EURO_2("2.00"),
  EURO_1("1.00"),
  EURO_0_50("0.50"),
  EURO_0_20("0.20"),
  EURO_0_10("0.10"),
  EURO_0_05("0.05"),
  EURO_0_02("0.02"),
  EURO_0_01("0.01");

  @Getter
  private final BigDecimal value;

  EuroDenominationEnum(String value) {
    this.value = new BigDecimal(value);
  }
}

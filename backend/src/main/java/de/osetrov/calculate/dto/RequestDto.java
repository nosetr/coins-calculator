package de.osetrov.calculate.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class RequestDto {
  @NotNull(message = "The new amount must not be NULL.")
  @DecimalMin(value = "0.00", message = "Der neue Betrag darf nicht negativ sein")
  BigDecimal newAmount;

  @DecimalMin(value = "0.00", message = "The amount must not be negative.")
  BigDecimal oldAmount;
}

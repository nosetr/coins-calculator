package de.osetrov.calculate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class RequestDto {
  @NotNull(message = "The new amount must not be NULL.")
  @DecimalMin(value = "0.00", message = "Der neue Betrag darf nicht negativ sein")
  @Schema(
      description = "Der neu zu berechnende Geldbetrag (muss >= 0.00 sein)",
      example = "120.50",
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  BigDecimal newAmount;

  @DecimalMin(value = "0.00", message = "The amount must not be negative.")
  @Schema(
      description = "Der alte Vergleichsbetrag (optional, muss >= 0.00 sein)",
      example = "100.00",
      requiredMode = Schema.RequiredMode.NOT_REQUIRED
  )
  BigDecimal oldAmount;
}

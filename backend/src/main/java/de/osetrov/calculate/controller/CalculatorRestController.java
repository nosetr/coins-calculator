package de.osetrov.calculate.controller;

import de.osetrov.calculate.dto.RequestDto;
import de.osetrov.calculate.dto.ResponseDto;
import de.osetrov.calculate.service.CalculatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
@Tag(name = "Wechselgeld-Rechner", description = "Endpunkte zur Berechnung der optimalen Stückelung von Wechselgeld")
public class CalculatorRestController {
  private final CalculatorService service;

  @PostMapping("/calculate")
  @Operation(
      summary = "Optimale Wechselgeld-Stückelung berechnen",
      description = "Berechnet die optimale Stückelung in Euro nach dem Prinzip: "
          + "größtmögliche Scheine und Münzen zuerst, um die Gesamtzahl zu minimieren). "
          + "Zusätzlich wird die Differenz der Stückelung im Vergleich zu einer vorherigen Berechnung ermittelt."
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "Berechnung erfolgreich",
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseDto.class))
      ),
      @ApiResponse(
          responseCode = "400", description = "Ungültige Eingabedaten nach der Validierung", content = @Content
      )
  })
  public ResponseEntity<ResponseDto> calculate(@Valid @RequestBody RequestDto request) {

    log.info("[CALCULATOR_REST_CONTROLLER] -> Received calculation request: New amount: {}, Old amount: {}",
        request.getNewAmount(), request.getOldAmount());

    BigDecimal newAmount = request.getNewAmount().setScale(2, RoundingMode.HALF_UP);
    BigDecimal oldAmount = request.getOldAmount() != null
        ? request.getOldAmount().setScale(2, RoundingMode.HALF_UP)
        : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    ResponseDto response = service.calculate(newAmount, oldAmount);

    log.info("[CALCULATOR_REST_CONTROLLER] -> Calculation successfully completed.");
    return ResponseEntity.ok(response);
  }
}

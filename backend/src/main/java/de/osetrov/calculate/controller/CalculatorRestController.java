package de.osetrov.calculate.controller;

import de.osetrov.calculate.dto.RequestDto;
import de.osetrov.calculate.dto.ResponseDto;
import de.osetrov.calculate.service.CalculatorService;
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
public class CalculatorRestController {
  private final CalculatorService service;

  @PostMapping("/calculate")
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

package de.osetrov.calculate.errorhandling;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Alle Validation-Fehler als Map ausgeben und loggen.
   */
  @SuppressWarnings("unused")
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {

    Map<String, Object> response = new HashMap<>();
    Map<String, String> messages = new HashMap<>();

    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      messages.put(fieldName, errorMessage);
      log.warn("[GLOBAL_EXCEPTION_HANDLER] -> Validation error in the field '{}': {}", fieldName, errorMessage);
    });

    response.put("error", true);
    response.put("messages", messages);

    return ResponseEntity.badRequest().body(response);
  }
}

package de.osetrov.calculate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CalculatorRestControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void calculate_WithValidRequest_ShouldReturnOk() throws Exception {
    Map<String, BigDecimal> requestMap = Map.of(
        "newAmount", new BigDecimal("120.50"),
        "oldAmount", new BigDecimal("100.00")
    );
    String request = objectMapper.writeValueAsString(requestMap);

    mockMvc.perform(
            post("/v1/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.newAmount").value(120.50))
        .andExpect(jsonPath("$.oldAmount").value(100.00))
        .andExpect(jsonPath("$.newDenomination['100.00']").value(1))
        .andExpect(jsonPath("$.difference['0.50']").value(1));
  }

  @Test
  void calculate_WithoutOldAmount_ShouldReturnOkWithoutDifferenceAndWithOldAmountAsZero() throws Exception {
    Map<String, BigDecimal> requestMap = Map.of(
        "newAmount", new BigDecimal("120.50")
    );
    String request = objectMapper.writeValueAsString(requestMap);

    mockMvc.perform(
            post("/v1/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.newAmount").value(120.50))
        .andExpect(jsonPath("$.oldAmount").value(0.00))
        .andExpect(jsonPath("$.newDenomination['100.00']").value(1))
        .andExpect(jsonPath("$.difference").doesNotExist());
  }

  @Test
  void calculate_WithoutNewAmount_WithError() throws Exception {
    Map<String, BigDecimal> requestMap = Map.of(
        "oldAmount", new BigDecimal("120.50")
    );
    String request = objectMapper.writeValueAsString(requestMap);

    mockMvc.perform(
            post("/v1/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
        )
        .andExpect(status().isBadRequest());
  }

  @Test
  void calculate_WithNegativeNewAmount_WithError() throws Exception {
    Map<String, BigDecimal> requestMap = Map.of(
        "newAmount", new BigDecimal("-120.50"),
        "oldAmount", new BigDecimal("100.00")
    );
    String request = objectMapper.writeValueAsString(requestMap);

    mockMvc.perform(
            post("/v1/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
        )
        .andExpect(status().isBadRequest());
  }

  @Test
  void calculate_WithNegativeOldAmount_WithError() throws Exception {
    Map<String, BigDecimal> requestMap = Map.of(
        "newAmount", new BigDecimal("120.50"),
        "oldAmount", new BigDecimal("-100.00")
    );
    String request = objectMapper.writeValueAsString(requestMap);

    mockMvc.perform(
            post("/v1/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
        )
        .andExpect(status().isBadRequest());
  }
}
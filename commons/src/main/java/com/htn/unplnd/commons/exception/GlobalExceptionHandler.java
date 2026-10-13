package com.htn.unplnd.commons.exception;

import com.htn.unplnd.commons.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
public class GlobalExceptionHandler {
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	ResponseEntity<ApiResponse> handleValidationException(MethodArgumentNotValidException ex){
		var message = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
		return ResponseEntity.badRequest().body(
				ApiResponse.builder()
				.message(message)
				.build()
		);
	}

	@ExceptionHandler(value = AppException.class)
	ResponseEntity<ApiResponse> handleAppException(AppException ex){
		log.info(ex.getErrorCode().getMessage());
		return ResponseEntity.status(ex.getErrorCode().getStatus()).body(
				ApiResponse.builder()
				.message(ex.getErrorCode().getMessage())
				.build()
		);
	}
}

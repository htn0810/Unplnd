package com.htn.unplnd.identity.exception;

import com.htn.unplnd.commons.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum IdentityException implements ErrorCode {
	EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already registered"),
	ACCOUNT_NOT_FOUND(HttpStatus.BAD_REQUEST, "Account not found"),
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"),;

	HttpStatus status;
	String message;
}

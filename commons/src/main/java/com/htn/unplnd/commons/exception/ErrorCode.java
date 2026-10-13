package com.htn.unplnd.commons.exception;

import org.springframework.http.HttpStatusCode;

public interface ErrorCode {
	HttpStatusCode getStatus();
	String getMessage();
}

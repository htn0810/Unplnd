package com.htn.unplnd.identity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignInRequest(
		@NotBlank(message = "Email should not empty.") @Email String email,
		@NotBlank(message = "Password should not empty.") @Size(max = 128) String password
) {
}

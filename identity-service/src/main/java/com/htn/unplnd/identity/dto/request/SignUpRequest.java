package com.htn.unplnd.identity.dto.request;

import com.htn.unplnd.identity.validator.FieldMatch;
import com.htn.unplnd.identity.validator.ValidateFieldMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ValidateFieldMatch
public class SignUpRequest {
	@NotBlank(message = "Email should not empty.")
	@Email(message = "Not correct format.")
	String email;

	@NotBlank(message = "Password should not empty.")
	@Size(min = 6, message = "At least 6 characters.")
	String password;

	@NotBlank(message = "Confirm password should not empty.")
	@FieldMatch(field = "password", message = "Password doesnt match.")
	String confirmPassword;
}

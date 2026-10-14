package com.htn.unplnd.identity.controller;

import com.htn.unplnd.commons.ApiResponse;
import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.dto.response.AccountResponse;
import com.htn.unplnd.identity.entity.Account;
import com.htn.unplnd.identity.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
	AuthenticationService authenticationService;

	@PostMapping("/sign-up")
	@ResponseStatus(HttpStatus.CREATED)
	ApiResponse<AccountResponse> signup(@RequestBody @Valid SignUpRequest signUpRequest) {
		AccountResponse account = authenticationService.createNewAccount(signUpRequest);
		return ApiResponse.<AccountResponse>builder()
				.message("Account created successfully")
				.result(account)
				.build();
	}
}

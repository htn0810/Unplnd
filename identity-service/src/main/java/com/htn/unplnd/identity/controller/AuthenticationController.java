package com.htn.unplnd.identity.controller;

import com.htn.unplnd.commons.ApiResponse;
import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.entity.Account;
import com.htn.unplnd.identity.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
	AuthenticationService authenticationService;

	@PostMapping("/sign-up")
	ApiResponse<Account> signup(@RequestBody @Valid SignUpRequest signUpRequest) {
		Account account = authenticationService.createNewAccount(signUpRequest);
		return ApiResponse.<Account>builder()
				.message("Account created successfully")
				.result(account)
				.build();
	}
}

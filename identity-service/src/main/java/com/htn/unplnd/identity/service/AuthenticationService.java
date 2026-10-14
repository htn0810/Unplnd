package com.htn.unplnd.identity.service;

import com.htn.unplnd.commons.exception.AppException;
import com.htn.unplnd.identity.dto.request.SignInRequest;
import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.dto.response.AccountResponse;
import com.htn.unplnd.identity.entity.Account;
import com.htn.unplnd.identity.exception.IdentityException;
import com.htn.unplnd.identity.mapper.AccountMapper;
import com.htn.unplnd.identity.repository.AccountRepository;
import com.htn.unplnd.identity.security.AccountPrincipal;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationService {
	AccountRepository accountRepository;
	PasswordEncoder passwordEncoder;
	AccountMapper accountMapper;
	AuthenticationManager authenticationManager;

	@Transactional
	public AccountResponse createNewAccount(SignUpRequest request) {
		String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

		if (accountRepository.existsAccountByEmail(email)) {
			throw new AppException(IdentityException.EMAIL_ALREADY_EXISTS);
		}

		Account account = accountMapper.toAccount(request);
		account.setEmail(email);
		var passwordHash = passwordEncoder.encode(request.getPassword());
		account.setPasswordHash(passwordHash);

		 try {
			 accountRepository.saveAndFlush(account);
		 } catch (DataIntegrityViolationException ex) {
			 throw new AppException(IdentityException.EMAIL_ALREADY_EXISTS);
		 }

		return accountMapper.toAccountResponse(account);
	}

	public AccountResponse signIn(SignInRequest request) {
		String email = request.email().trim().toLowerCase(Locale.ROOT);
		try {
			Authentication authentication = authenticationManager.authenticate(
					UsernamePasswordAuthenticationToken.unauthenticated(email, request.password())
			);
			AccountPrincipal principal = (AccountPrincipal) authentication.getPrincipal();
			return new AccountResponse(principal.id(), principal.email());
		} catch (AuthenticationException ex) {
			throw new AppException(IdentityException.INVALID_CREDENTIALS);
		}
	}
}

package com.htn.unplnd.identity.service;

import com.htn.unplnd.commons.exception.AppException;
import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.dto.response.AccountResponse;
import com.htn.unplnd.identity.entity.Account;
import com.htn.unplnd.identity.exception.IdentityException;
import com.htn.unplnd.identity.mapper.AccountMapper;
import com.htn.unplnd.identity.repository.AccountRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationService {
	AccountRepository accountRepository;
	PasswordEncoder passwordEncoder;
	AccountMapper accountMapper;

	@Transactional
	public AccountResponse createNewAccount(SignUpRequest request) {
		String email = request.getEmail().trim();

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
}

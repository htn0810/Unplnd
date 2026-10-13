package com.htn.unplnd.identity.service;

import com.htn.unplnd.commons.exception.AppException;
import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.entity.Account;
import com.htn.unplnd.identity.exception.IdentityException;
import com.htn.unplnd.identity.mapper.AccountMapper;
import com.htn.unplnd.identity.repository.AccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationService {
	AccountRepository accountRepository;
	PasswordEncoder passwordEncoder;
	AccountMapper accountMapper;

	public Account createNewAccount(SignUpRequest request) {
		if (accountRepository.existsAccountByEmail(request.getEmail())) {
			throw new AppException(IdentityException.EMAIL_ALREADY_EXISTS);
		}

		Account account = accountMapper.toAccount(request);
		var passwordHash = passwordEncoder.encode(request.getPassword());
		account.setPasswordHash(passwordHash);

		return accountRepository.save(account);
	}
}

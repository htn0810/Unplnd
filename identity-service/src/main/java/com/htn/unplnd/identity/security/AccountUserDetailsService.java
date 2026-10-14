package com.htn.unplnd.identity.security;

import com.htn.unplnd.commons.exception.AppException;
import com.htn.unplnd.identity.exception.IdentityException;
import com.htn.unplnd.identity.repository.AccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountUserDetailsService implements UserDetailsService {
	AccountRepository accountRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		return accountRepository.findAccountByEmail(email)
				// Filter để lọc những acount login bằng google (k có password lúc đầu)
				.filter(account -> account.getPasswordHash() != null)
				.map(account -> new AccountPrincipal(account.getId(), account.getEmail(), account.getPasswordHash()))
				.orElseThrow(() -> new AppException(IdentityException.ACCOUNT_NOT_FOUND));
	}
}

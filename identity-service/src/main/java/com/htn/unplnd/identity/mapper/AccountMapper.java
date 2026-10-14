package com.htn.unplnd.identity.mapper;

import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.dto.response.AccountResponse;
import com.htn.unplnd.identity.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "passwordHash", ignore = true)
	Account toAccount(SignUpRequest request);

	AccountResponse toAccountResponse(Account account);
}

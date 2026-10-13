package com.htn.unplnd.identity.mapper;

import com.htn.unplnd.identity.dto.request.SignUpRequest;
import com.htn.unplnd.identity.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
	Account toAccount(SignUpRequest request);
}

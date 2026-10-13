package com.htn.unplnd.mapper;

import com.htn.unplnd.dto.request.SignUpRequest;
import com.htn.unplnd.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
	Account toAccount(SignUpRequest request);
}

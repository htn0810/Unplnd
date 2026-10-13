package com.htn.unplnd.commons.configuration;

import com.htn.unplnd.commons.exception.GlobalExceptionHandler;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class CommonsWebAutoConfiguration {

	@Bean
	@ConditionalOnMissingBean(GlobalExceptionHandler.class)
	GlobalExceptionHandler globalExceptionHandler() {
		return new GlobalExceptionHandler();
	}
}

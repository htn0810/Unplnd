package com.htn.unplnd.identity.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = com.htn.unplnd.identity.validator.FieldMatchValidator.class)
@Documented
public @interface ValidateFieldMatch {
	String message() default "Value doesnt match";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
package com.htn.unplnd.validator;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FieldMatch {
	String field();
	String message() default "Value doesnt match";
}
package com.htn.unplnd.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

public class FieldMatchValidator implements ConstraintValidator<ValidateFieldMatch, Object> {

	// Cache danh sách field có @FieldMatch theo class, tránh reflection lặp lại mỗi request
	private static final Map<Class<?>, List<Field>> CACHE = new ConcurrentHashMap<>();

	@Override
	public boolean isValid(Object target, ConstraintValidatorContext context) {
		if (target == null) return true;

		boolean valid = true;
		context.disableDefaultConstraintViolation();

		for (Field annotated : annotatedFields(target.getClass())) {
			FieldMatch rule = annotated.getAnnotation(FieldMatch.class);
			Object value = read(annotated, target);
			Object other = read(findField(target.getClass(), rule.field()), target);

			if (value == null || other == null) continue; // để @NotBlank/@NotNull xử lý

			if (!Objects.equals(value, other)) {
				valid = false;
				context.buildConstraintViolationWithTemplate(rule.message())
						.addPropertyNode(annotated.getName())
						.addConstraintViolation();
			}
		}
		return valid;
	}

	private static List<Field> annotatedFields(Class<?> clazz) {
		return CACHE.computeIfAbsent(clazz, c -> {
			List<Field> result = new ArrayList<>();
			for (Class<?> k = c; k != null && k != Object.class; k = k.getSuperclass()) {
				for (Field f : k.getDeclaredFields()) {
					if (f.isAnnotationPresent(FieldMatch.class)) {
						f.setAccessible(true);
						result.add(f);
					}
				}
			}
			return List.copyOf(result);
		});
	}

	private static Field findField(Class<?> clazz, String name) {
		for (Class<?> k = clazz; k != null && k != Object.class; k = k.getSuperclass()) {
			try {
				Field f = k.getDeclaredField(name);
				f.setAccessible(true);
				return f;
			} catch (NoSuchFieldException ignored) { }
		}
		throw new IllegalStateException(
				"@FieldMatch tham chiếu tới field không tồn tại: '" + name + "' trong " + clazz.getName());
	}

	private static Object read(Field field, Object target) {
		try {
			return field.get(target);
		} catch (IllegalAccessException e) {
			throw new IllegalStateException("Không đọc được field " + field.getName(), e);
		}
	}
}

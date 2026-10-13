package com.htn.unplnd.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "accounts",
		uniqueConstraints = @UniqueConstraint(name = "uk_accounts_email", columnNames = "email"))
public class Account {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	@Column(nullable = false)
	String email;

	@Column(name = "password_hash")
	String passwordHash;
}

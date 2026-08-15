const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 50;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9!@#$%&*_.?-]+$/;
const ENGLISH_LETTER_PATTERN = /[A-Za-z]/;
const NUMBER_PATTERN = /\d/;
const WHITESPACE_PATTERN = /\s/;

export function validateName(name) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "Name is required";
  }

  if (normalizedName.length > USERNAME_MAX_LENGTH) {
    return `Name cannot contain more than ${USERNAME_MAX_LENGTH} characters`;
  }

  return "";
}

export function validateEmail(email) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email is required";
  }

  if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
    return `Email cannot contain more than ${EMAIL_MAX_LENGTH} characters`;
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return "Enter a valid email address, for example name@example.com";
  }

  return "";
}

export function validateUsername(username) {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return "Username is required";
  }

  if (normalizedUsername.length < USERNAME_MIN_LENGTH) {
    return `Username must contain at least ${USERNAME_MIN_LENGTH} characters`;
  }

  if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
    return `Username cannot contain more than ${USERNAME_MAX_LENGTH} characters`;
  }

  if (!ENGLISH_LETTER_PATTERN.test(normalizedUsername)) {
    return "Username must contain at least one English letter";
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return (
      "Username may contain English letters, numbers, and these symbols: " +
      "! @ # $ % & * _ . ? -"
    );
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password cannot contain more than ${PASSWORD_MAX_LENGTH} characters`;
  }

  if (WHITESPACE_PATTERN.test(password)) {
    return "Password cannot contain spaces";
  }

  if (!ENGLISH_LETTER_PATTERN.test(password)) {
    return "Password must contain at least one English letter";
  }

  if (!NUMBER_PATTERN.test(password)) {
    return "Password must contain at least one number";
  }

  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
}

export function validateLoginPassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password cannot contain more than ${PASSWORD_MAX_LENGTH} characters`;
  }

  return "";
}

/**
 * Plain validation predicates, shared by every validator middleware.
 * Kept dependency-free and framework-agnostic on purpose — they are
 * pure functions that just return true/false.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 8-16 chars, at least one uppercase letter and one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const isValidName = (name) => {
  return (
    typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60
  );
};
const isValidAddress = (address) =>
  address === undefined || address === null || address.length <= 400;

const isValidEmail = (email) => typeof email === 'string' && EMAIL_REGEX.test(email);

const isValidPassword = (password) =>
  typeof password === 'string' && PASSWORD_REGEX.test(password);

const isValidRating = (rating) =>
  Number.isInteger(rating) && rating >= 1 && rating <= 5;

const isValidRole = (role) => ['ADMIN', 'NORMAL', 'OWNER'].includes(role);

module.exports = {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword,
  isValidRating,
  isValidRole,
};

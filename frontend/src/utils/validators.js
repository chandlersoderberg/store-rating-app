export const validateName = (name) => {
  const len = name.trim().length;
  if (len === 0) return 'Name is required.';
  if (len < 20 || len > 60) return 'Name must be between 20 and 60 characters.';
  return '';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Enter a valid email address.';
  return '';
};

export const validateAddress = (address) => {
  if (address && address.length > 400) return 'Address must not exceed 400 characters.';
  return '';
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  if (!regex.test(password)) {
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character.';
  }
  return '';
};

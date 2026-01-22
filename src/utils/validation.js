// src/utils/validation.js
// Input Validation Utilities cho Gia Đình Thông Minh

// =====================================================
// EMAIL VALIDATION
// =====================================================

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email không được để trống' };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email không được để trống' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email quá dài' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }

  return { valid: true, value: trimmed.toLowerCase() };
};

// =====================================================
// PASSWORD VALIDATION
// =====================================================

export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecial = false,
  } = options;

  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Mật khẩu không được để trống' };
  }

  if (password.length < minLength) {
    return { valid: false, error: `Mật khẩu phải có ít nhất ${minLength} ký tự` };
  }

  if (password.length > maxLength) {
    return { valid: false, error: `Mật khẩu không được quá ${maxLength} ký tự` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 chữ in hoa' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 chữ thường' };
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 số' };
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt' };
  }

  return { valid: true };
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Chưa nhập', color: 'gray' };

  let score = 0;

  // Length bonus
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  const levels = [
    { min: 0, label: 'Yếu', color: 'red' },
    { min: 3, label: 'Trung bình', color: 'orange' },
    { min: 5, label: 'Khá', color: 'yellow' },
    { min: 7, label: 'Mạnh', color: 'green' },
  ];

  const level = levels.filter(l => score >= l.min).pop();

  return {
    score,
    label: level.label,
    color: level.color,
  };
};

// =====================================================
// NAME VALIDATION
// =====================================================

export const validateName = (name, options = {}) => {
  const {
    minLength = 1,
    maxLength = 50,
    fieldName = 'Tên',
  } = options;

  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} không được để trống` };
  }

  const trimmed = name.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} phải có ít nhất ${minLength} ký tự` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} không được quá ${maxLength} ký tự` };
  }

  // Chặn các ký tự nguy hiểm (XSS prevention)
  const dangerousChars = /<|>|&|"|'|`|;|\\|\{|\}/;
  if (dangerousChars.test(trimmed)) {
    return { valid: false, error: `${fieldName} chứa ký tự không hợp lệ` };
  }

  return { valid: true, value: trimmed };
};

export const validateChildName = (name) => {
  return validateName(name, {
    minLength: 1,
    maxLength: 30,
    fieldName: 'Tên bé',
  });
};

export const validateParentName = (name) => {
  return validateName(name, {
    minLength: 2,
    maxLength: 50,
    fieldName: 'Tên phụ huynh',
  });
};

// =====================================================
// AGE VALIDATION
// =====================================================

export const validateAge = (age) => {
  if (age === null || age === undefined || age === '') {
    return { valid: true, value: null }; // Age is optional
  }

  const numAge = parseInt(age, 10);

  if (isNaN(numAge)) {
    return { valid: false, error: 'Tuổi phải là số' };
  }

  if (numAge < 1 || numAge > 18) {
    return { valid: false, error: 'Tuổi phải từ 1 đến 18' };
  }

  return { valid: true, value: numAge };
};

// =====================================================
// AVATAR VALIDATION
// =====================================================

const VALID_AVATARS = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🦊', '🐰', '🐼', '🦁', '🐸', '🐵'];

export const validateAvatar = (avatar) => {
  if (!avatar) {
    return { valid: true, value: '👦' }; // Default avatar
  }

  if (!VALID_AVATARS.includes(avatar)) {
    return { valid: false, error: 'Avatar không hợp lệ' };
  }

  return { valid: true, value: avatar };
};

// =====================================================
// GENDER VALIDATION
// =====================================================

const VALID_GENDERS = ['male', 'female', 'other', null];

export const validateGender = (gender) => {
  if (!gender || gender === '') {
    return { valid: true, value: null }; // Gender is optional
  }

  if (!VALID_GENDERS.includes(gender)) {
    return { valid: false, error: 'Giới tính không hợp lệ' };
  }

  return { valid: true, value: gender };
};

// =====================================================
// PIN VALIDATION
// =====================================================

export const validatePin = (pin) => {
  if (!pin || typeof pin !== 'string') {
    return { valid: false, error: 'Mã PIN không được để trống' };
  }

  if (!/^\d{4}$/.test(pin)) {
    return { valid: false, error: 'Mã PIN phải là 4 chữ số' };
  }

  // Chặn PIN quá đơn giản
  const simplePatterns = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '3210'];
  if (simplePatterns.includes(pin)) {
    return { valid: false, error: 'Mã PIN quá đơn giản, vui lòng chọn số khác' };
  }

  return { valid: true, value: pin };
};

// =====================================================
// CHILD DATA VALIDATION (Combined)
// =====================================================

export const validateChildData = (data) => {
  const errors = [];

  // Validate name
  const nameResult = validateChildName(data.name);
  if (!nameResult.valid) {
    errors.push(nameResult.error);
  }

  // Validate avatar
  const avatarResult = validateAvatar(data.avatar);
  if (!avatarResult.valid) {
    errors.push(avatarResult.error);
  }

  // Validate age
  const ageResult = validateAge(data.age);
  if (!ageResult.valid) {
    errors.push(ageResult.error);
  }

  // Validate gender
  const genderResult = validateGender(data.gender);
  if (!genderResult.valid) {
    errors.push(genderResult.error);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: nameResult.value,
      avatar: avatarResult.value,
      age: ageResult.value,
      gender: genderResult.value,
    },
  };
};

// =====================================================
// SIGNUP DATA VALIDATION
// =====================================================

export const validateSignupData = (data) => {
  const errors = [];

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.push(emailResult.error);
  }

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.valid) {
    errors.push(passwordResult.error);
  }

  // Validate confirm password
  if (data.password !== data.confirmPassword) {
    errors.push('Mật khẩu xác nhận không khớp');
  }

  // Validate parent name
  const nameResult = validateParentName(data.parentName);
  if (!nameResult.valid) {
    errors.push(nameResult.error);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      email: emailResult.value,
      password: data.password,
      parentName: nameResult.value,
    },
  };
};

// =====================================================
// SANITIZE FUNCTIONS
// =====================================================

export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// =====================================================
// EXPORTS
// =====================================================

export default {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateName,
  validateChildName,
  validateParentName,
  validateAge,
  validateAvatar,
  validateGender,
  validatePin,
  validateChildData,
  validateSignupData,
  sanitizeString,
  sanitizeHtml,
};

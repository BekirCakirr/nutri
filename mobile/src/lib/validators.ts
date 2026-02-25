export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function isValidPhone(phone: string): boolean {
  const re = /^(\+90|0)?[5][0-9]{9}$/;
  return re.test(phone.replace(/\s/g, ''));
}

export function isValidWeight(weight: number): boolean {
  return weight > 20 && weight < 500;
}

export function isValidHeight(height: number): boolean {
  return height > 50 && height < 300;
}

export function isValidAge(age: number): boolean {
  return age >= 1 && age <= 150;
}

export function isValidCalories(calories: number): boolean {
  return calories >= 0 && calories <= 10000;
}

export function isValidWaterIntake(ml: number): boolean {
  return ml >= 0 && ml <= 10000;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  if (!email.trim()) return { isValid: false, error: 'E-posta gerekli' };
  if (!isValidEmail(email)) return { isValid: false, error: 'Ge\u00e7erli bir e-posta girin' };
  if (!password) return { isValid: false, error: '\u015eifre gerekli' };
  if (!isValidPassword(password)) return { isValid: false, error: '\u015eifre en az 6 karakter olmal\u0131' };
  return { isValid: true };
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
): ValidationResult {
  if (!name.trim()) return { isValid: false, error: '\u0130sim gerekli' };
  if (!isValidName(name)) return { isValid: false, error: '\u0130sim en az 2 karakter olmal\u0131' };
  if (!email.trim()) return { isValid: false, error: 'E-posta gerekli' };
  if (!isValidEmail(email)) return { isValid: false, error: 'Ge\u00e7erli bir e-posta girin' };
  if (!password) return { isValid: false, error: '\u015eifre gerekli' };
  if (!isValidPassword(password)) return { isValid: false, error: '\u015eifre en az 6 karakter olmal\u0131' };
  return { isValid: true };
}

export function validateProfileForm(values: {
  height?: number;
  weight?: number;
  targetWeight?: number;
}): ValidationResult {
  if (values.height !== undefined && !isValidHeight(values.height)) {
    return { isValid: false, error: 'Ge\u00e7erli bir boy girin (50-300 cm)' };
  }
  if (values.weight !== undefined && !isValidWeight(values.weight)) {
    return { isValid: false, error: 'Ge\u00e7erli bir kilo girin (20-500 kg)' };
  }
  if (values.targetWeight !== undefined && !isValidWeight(values.targetWeight)) {
    return { isValid: false, error: 'Ge\u00e7erli bir hedef kilo girin' };
  }
  return { isValid: true };
}

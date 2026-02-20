// ============= Validation Utilities =============

export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 chars, at least one letter and one number)
export const isValidPassword = (password) => {
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

// Name validation
export const isValidName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Login form validation
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Register form validation
export const validateRegisterForm = (name, email, password, confirmPassword) => {
  const errors = {};

  if (!isRequired(name)) {
    errors.name = "Name is required";
  } else if (!isValidName(name)) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password =
      "Password must be at least 6 characters with letters and numbers";
  }

  if (!isRequired(confirmPassword)) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Internship form validation
export const validateInternshipForm = (data) => {
  const errors = {};

  if (!isRequired(data.title)) {
    errors.title = "Title is required";
  } else if (data.title.length > 200) {
    errors.title = "Title must be less than 200 characters";
  }

  if (!isRequired(data.company)) {
    errors.company = "Company is required";
  }

  if (!isRequired(data.description)) {
    errors.description = "Description is required";
  }

  if (!isRequired(data.type)) {
    errors.type = "Type is required";
  }

  if (!isRequired(data.duration)) {
    errors.duration = "Duration is required";
  }

  if (!data.internshipCount || data.internshipCount < 1) {
    errors.internshipCount = "Internship count must be at least 1";
  }

  if (!data.requiredSkills || data.requiredSkills.length === 0) {
    errors.requiredSkills = "At least one skill is required";
  }

  if (!isRequired(data.deadline)) {
    errors.deadline = "Deadline is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Task form validation
export const validateTaskForm = (data) => {
  const errors = {};

  if (!isRequired(data.title)) {
    errors.title = "Title is required";
  }

  if (!isRequired(data.description)) {
    errors.description = "Description is required";
  }

  if (!isRequired(data.program)) {
    errors.program = "Program is required";
  }

  if (!isRequired(data.deadline)) {
    errors.deadline = "Deadline is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

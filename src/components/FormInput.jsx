import React from "react";

/**
 * FormInput Component
 * Renders input field with label and error message
 * @param {string} label - Input label
 * @param {string} name - Input name attribute
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Current value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message to display
 * @param {boolean} required - Is field required
 */
function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "10px",
          border: error ? "2px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <span style={{ color: "red", fontSize: "12px", display: "block", marginTop: "5px" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default FormInput;

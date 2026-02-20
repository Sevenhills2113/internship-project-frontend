import React from "react";

/**
 * Alert Component
 * Displays alert messages (error, success, warning, info)
 * @param {string} type - Alert type (error, success, warning, info)
 * @param {string} message - Message to display
 * @param {function} onClose - Callback to close alert
 */
function Alert({ type = "info", message, onClose }) {
  const styles = {
    error: {
      backgroundColor: "#ffe0e0",
      borderLeft: "4px solid red",
      color: "red",
    },
    success: {
      backgroundColor: "#e0ffe0",
      borderLeft: "4px solid green",
      color: "green",
    },
    warning: {
      backgroundColor: "#fffae0",
      borderLeft: "4px solid orange",
      color: "orange",
    },
    info: {
      backgroundColor: "#e0f0ff",
      borderLeft: "4px solid blue",
      color: "blue",
    },
  };

  const icons = {
    error: "❌",
    success: "✅",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      style={{
        ...styles[type],
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <span>
        {icons[type]} {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "inherit",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;

import React from "react";

/**
 * Card Component
 * Renders a consistent card container for content
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {string} className - CSS class name
 * @param {object} style - Additional inline styles
 */
function Card({ children, title, className = "", style = {} }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            marginTop: 0,
            marginBottom: "15px",
            fontSize: "18px",
            fontWeight: "600",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "10px",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default Card;

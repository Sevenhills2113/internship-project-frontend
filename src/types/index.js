/**
 * ============= DTOs / Data Models =============
 * Defined as JSDoc for type documentation without TypeScript
 */

/**
 * @typedef {Object} UserDTO
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'INTERN' | 'MENTOR' | 'ADMIN'} role
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} AuthResponseDTO
 * @property {string} status
 * @property {string} [token]
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} [message]
 */

/**
 * @typedef {Object} InternshipDTO
 * @property {number} id
 * @property {string} title
 * @property {string} company
 * @property {string} description
 * @property {string} type - Remote, On-site, Hybrid
 * @property {string} duration - e.g., "3 months"
 * @property {number} internshipCount
 * @property {string[]} requiredSkills
 * @property {string} deadline
 * @property {number} [progress]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} TaskDTO
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} program
 * @property {string} deadline
 * @property {'Pending' | 'In Progress' | 'Completed'} status
 * @property {string} [assignedBy]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} SubmissionDTO
 * @property {number} id
 * @property {number} internId
 * @property {string} internName
 * @property {string} taskName
 * @property {number} taskId
 * @property {string} program
 * @property {string} submittedDate
 * @property {'Pending' | 'Approved' | 'Rejected'} status
 * @property {'low' | 'medium' | 'high'} [priority]
 * @property {string} [review]
 * @property {string} [reviewedAt]
 */

/**
 * @typedef {Object} CertificateDTO
 * @property {number} id
 * @property {number} internId
 * @property {string} internName
 * @property {string} program
 * @property {string} issuedDate
 * @property {string} [expiryDate]
 */

/**
 * @typedef {Object} NotificationDTO
 * @property {number} id
 * @property {number} userId
 * @property {string} title
 * @property {string} message
 * @property {string} date
 * @property {boolean} read
 */

/**
 * @typedef {Object} ResourceDTO
 * @property {number} id
 * @property {string} title
 * @property {string} link
 * @property {string} category
 * @property {string} type - Documentation, Tutorial, Tool, etc.
 */

/**
 * @typedef {Object} DashboardOverviewDTO
 * @property {number} active
 * @property {number} completed
 * @property {number} pending
 * @property {number} certificates
 */

/**
 * @typedef {Object} ApiErrorResponseDTO
 * @property {string} status
 * @property {string} message
 * @property {string} [code]
 * @property {string} [timestamp]
 * @property {Object} [errors]
 */

/**
 * @typedef {Object} PaginationDTO
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object.<string, *>} ApiResponseDTO
 */

export {};

/**
 * Handles validation errors by rendering the appropriate view with error messages
 * @param {Object} result - The validation result from express-validator
 * @param {Object} res - The Express response object
 * @param {string} view - The view template path to render
 * @param {string} pageTitle - The title of the page to display
 * @param {Object} userData - Optional user data to preserve in the form (default: {})
 * @returns {boolean} Returns true if errors exist and response was sent, false otherwise
 */
const handleValidationErrors = (result, res, view, pageTitle, userData = {}) => {
  if (!result.isEmpty()) {
    res.render(view, {
      page: pageTitle,
      csrfToken: res.locals.csrfToken,
      errors: result.array(),
      user: userData,
    });
    return true;
  }
  return false;
};

/**
 * Renders an error message in the specified view
 * @param {string} route - The view template path to render
 * @param {string} pageTitle - The title of the page to display
 * @param {string} errorMessage - The error message to show
 * @param {Object} res - The Express response object
 * @param {Object} userData - Optional user data to preserve in the form (default: {})
 * @returns {boolean} Returns true to indicate response was sent
 */
 function errMessage(route, pageTitle, errorMessage, res, userData = {}){
    res.render(route, {
        csrfToken: res.locals.csrfToken,
        page: pageTitle,
        errors: [{ msg: errorMessage }],
        user: userData,
    });
    return true;
}

export { handleValidationErrors, errMessage };
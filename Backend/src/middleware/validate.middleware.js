import ApiError from "../utils/ApiError.js";

/**
 * Validation middleware runner
 * @param {Function} validatorFn Validator function that returns { isValid, errors }
 * @param {'body' | 'query' | 'params'} source Source in request to validate
 */
export const validate = (validatorFn, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { isValid, errors } = validatorFn(dataToValidate);

    if (!isValid) {
      const errorMessage = Array.isArray(errors) ? errors.join(", ") : (errors || "Validation error");
      return next(new ApiError(400, errorMessage, Array.isArray(errors) ? errors : [errors]));
    }

    next();
  };
};

export default validate;

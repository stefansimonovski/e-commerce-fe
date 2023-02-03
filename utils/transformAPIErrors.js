const transformAPIError = error => {
  const errorMessages = error.response.data?.errors;
  const transformedErrorMessages = {};

  Object.keys(errorMessages).forEach(err => {
    transformedErrorMessages[
      [err.substr(0, 1).toUpperCase() + err.substr(1, err.length)]
    ] = [errorMessages[err]];
  });
  return transformedErrorMessages;
};

export default transformAPIError;

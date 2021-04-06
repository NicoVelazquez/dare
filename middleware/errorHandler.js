import parseError from 'parse-error';

const errorHandler = (error, request, response, next) => {
  const statusCode = error.code || error.status || 500;
  let jsonError;
  try {
    jsonError = parseError(error);
  } catch (ex) {
    jsonError = error;
  }

  if (request.app.get('env') !== 'production' && request.app.get('env') !== 'testing') {
    response.status(statusCode).json(jsonError);
  } else {
    response.status(statusCode).send({
      message: jsonError.message,
      code: statusCode,
    });
  }
  next();
};

export default errorHandler;

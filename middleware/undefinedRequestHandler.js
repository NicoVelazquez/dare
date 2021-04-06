const undefinedRequestHandler = (request, response) => {
    const responseMessage = {
        success: false,
        message: `Not Found Route, ${request.method}, ${request.path}`,
        code: 404
    };
    response.status(404).json(responseMessage)
};

export default undefinedRequestHandler;

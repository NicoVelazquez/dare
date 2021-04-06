import joi from '@hapi/joi';

const validUsernameRegex = /^[A-Za-z0-9_-]{3,16}$/;
const loginValidation = {
  body: {
    username: joi.string().required().regex(validUsernameRegex),
    password: joi.string().min(6).required(),
  },
};

export default loginValidation;

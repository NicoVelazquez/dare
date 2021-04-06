import joi from '@hapi/joi';

const validIdRegex = /^[^*|":<>[\]{}`\\()';@&$]+$/;

export const getClientsValidation = {
  query: {
    limit: joi.number(),
    name: joi.string(),
    page: joi.string(),
  },
};
export const getClientValidation = {
  params: {
    id: joi.string().regex(validIdRegex).required(),
  },
};

import joi from '@hapi/joi';

const validIdRegex = /^[^*|":<>[\]{}`\\()';@&$]+$/;

export const getPoliciesValidation = {
  query: {
    limit: joi.number(),
  },
};

export const getPolicyValidation = {
  params: {
    id: joi.string().required().regex(validIdRegex),
  },
};

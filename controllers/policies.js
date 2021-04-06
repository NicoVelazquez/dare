import _ from 'lodash';
import { userRolesEnums } from '../middleware/enum/users';
import { findPoliciesByFilter, findAllPolicies, findPolicy } from '../services/policies';

export const getPolicies = async (req, res) => {
  const { user, query } = req;
  let result = [];
  if (user.role === userRolesEnums[userRolesEnums.user]) {
    result = await findPoliciesByFilter({ filed: 'clientId', value: user.id });
  } else result = await findAllPolicies(query);
  if (_.isEmpty(result)) {
    const responseMessage = {
      success: false,
      message: 'Not found',
      code: 404
    };
    return res.status(404).json(responseMessage);
  }
  return res.status(200).json(result);
};

export const getPolicy = async (req, res) => {
  const {
    user,
    params: { id: policyId },
  } = req;
  const policy = await findPolicy({ field: 'id', value: policyId });
  if (user.role === userRolesEnums[userRolesEnums.admin]) {
    return res.status(200).json(policy);
  }
  if (policy.clientId !== user.id) {
    const responseMessage = {
      success: false,
      message: 'Unauthorized',
      code: 401
    };
    return res.status(401).json(responseMessage);
  }
  return res.status(200).json(policy);
};

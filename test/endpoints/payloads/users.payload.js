export const validLoginAdmin = {
  username: 'admin',
  password: '12345678',
};

export const validLoginUser = {
  username: 'user',
  password: '12345678',
};

export const notExistedUser = {
  username: 'user1',
  password: '12345678',
};

export const invalidUsernameValidation = {
  username: 'test.com',
  password: 'test1234',
};
export const missingUsernameValidation = {
  password: 'test1234',
};

export const invalidPasswordValidation = {
  username: 'user',
  password: 'test',
};

export const missingPasswordValidation = {
  username: 'user',
};

export const emptyUsername = {
  username: '',
  password: '12345678',
};

export const emptyPassword = {
  username: 'user',
  password: '',
};

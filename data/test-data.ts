export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

export const checkoutCustomer = {
  firstName: 'Guilherme',
  lastName: 'Mori',
  postalCode: '13000-000',
} as const;

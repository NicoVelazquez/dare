export const nockPoliciesResponse = [...new Array(10)].map((_, index) => {
  return {
    id: `${index + 1}`,
    amountInsured: 1825.89,
    email: 'email',
    inceptionDate: 'dateTime',
    installmentPayment: true,
    clientId: `${index + 1}`,
  };
});

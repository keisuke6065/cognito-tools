exports.createParam = (userPoolId, data) => {
  const attributes = data.Attributes.filter(a => a.Name !== 'sub');
  const email = data.Attributes.filter(
      a => a.Name === 'email')[0].Value;
  // Username = email
  return {
    UserPoolId: userPoolId,
    Username: email,
    UserAttributes: attributes,
    DesiredDeliveryMediums: [], // EMAIL or SMS
    MessageAction: 'SUPPRESS', //or RESEND
    ForceAliasCreation: false,
    // TemporaryPassword: tempPassword,
  };
};

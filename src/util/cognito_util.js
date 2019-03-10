exports.adminCreateUser = (cognitoIsp, param) => {
  return cognitoIsp.adminCreateUser(param).promise();
};

exports.signUp = (cognitoIsp, param) => {
  return cognitoIsp.signUp(param).promise();
};

exports.forceCreateUser = (cognitoIsp, data, userPoolId, clientId) => {
  if (data.password === '') {
    const adminParam = createAdminParam(userPoolId, data);

    return cognitoIsp.adminCreateUser(adminParam).promise().then(
        async value => {
          const uuid = value.User.Username;
          if (data.facebookId !== '') {
            await linkFacebookProvider(cognitoIsp, userPoolId, uuid,
                data.facebookId).catch(err => console.error(err));
          }
          return uuid;
        });
  }
  const signUpParam = createSignUpParam(clientId, data);
  return cognitoIsp.signUp(signUpParam).promise().then(async value => {
    const uuid = value.UserSub;
    if (data.facebookId !== '') {
      await linkFacebookProvider(cognitoIsp, userPoolId, uuid, data.facebookId).
          catch(err => console.error(err));
    }
    return uuid;
  });
};

exports.createParam = (userPoolId, data) => {
  const attributes = data.Attributes.filter(a => a.Name !== 'sub' || a.Name !== 'identities');
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

const linkFacebookProvider = (cognitoIsp, userPoolId, uuid, facebookId) => {
  const param = {
    DestinationUser: {
      ProviderName: 'Cognito',
      ProviderAttributeName: null,
      ProviderAttributeValue: uuid,
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: facebookId.toString(),
      ProviderName: 'Facebook',
    },
    UserPoolId: userPoolId,
  };
  return cognitoIsp.adminLinkProviderForUser(param).promise();
};

const createAdminParam = (userPoolId, data) => {
  const attributes = Object.keys(data).
      filter((key) => ['password', 'facebookId'].indexOf(key) === -1).
      map(key => ({
            Name: key,
            Value: data[key],
          }
      ));
  return {
    UserPoolId: userPoolId,
    Username: data.email,
    UserAttributes: [...attributes, {Name: 'email_verified', Value: 'true'}],
    DesiredDeliveryMediums: [], // EMAIL or SMS
    MessageAction: 'SUPPRESS', //or RESEND
    ForceAliasCreation: false,
    // TemporaryPassword: tempPassword,
  };
};

const createSignUpParam = (clientId, data) => {
  const attributes = Object.keys(data).
      filter((key) => ['email', 'password', 'facebookId'].indexOf(key) === -1).
      map(key => ({
            Name: key,
            Value: data[key],
          }
      ));
  return {
    ClientId: clientId,
    Username: data.email,
    UserAttributes: attributes,
    Password: data.password,
  };
};

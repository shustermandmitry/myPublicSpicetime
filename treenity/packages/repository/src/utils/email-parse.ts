const TESTER_REGEXP =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const emailParser = (email: string): string => {
  if (!email) {
    throw new Error('Email is required');
  }

  const clearEmail = email.toLowerCase().trim();
  if (clearEmail.length > 254) {
    throw new Error("Email can't be longer than 254 characters");
  }

  const valid = TESTER_REGEXP.test(clearEmail);
  if (!valid) {
    throw new Error('Email is not valid');
  }

  return clearEmail;
};

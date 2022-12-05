export const generateAuthCode = () =>
  Math.random().toString(36).slice(-6).toLocaleLowerCase().trim().toString();

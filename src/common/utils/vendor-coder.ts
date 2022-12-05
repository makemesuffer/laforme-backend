export const generateVendorCode = () =>
  Math.random().toString(36).slice(-6).toUpperCase().toString();

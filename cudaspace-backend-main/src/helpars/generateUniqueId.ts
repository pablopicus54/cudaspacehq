export const generateOrderId = () => {
  const date = new Date();
  const timestamp = date.getTime(); // current timestamp in milliseconds
  const randomDigits = Math.floor(Math.random() * 10000); // random digits for added uniqueness
  return `${timestamp}${randomDigits}`; // concatenate timestamp and random digits
};
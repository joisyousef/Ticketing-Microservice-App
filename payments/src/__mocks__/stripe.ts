export const stripe = {
  paymentIntent: {
    create: jest.fn().mockResolvedValue({}),
  },
};

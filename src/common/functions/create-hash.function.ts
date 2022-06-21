import * as crypto from 'crypto';

export const generateHash = () => {
  return crypto
    .pseudoRandomBytes(20)
    .toString('hex');
};

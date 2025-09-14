import grpc from 'grpc';
import jwt from 'jsonwebtoken';

const TEN_MINUTES = 10 * 60;

export function authorizationMetadata(apiKey, secretKey, scope) {
  const auth_payload = {
    iss: 'test_issuer',
    sub: 'test_user',
    aud: scope,
  };

  const token = jwt.sign(auth_payload, Buffer.from(secretKey, 'base64'), {
    expiresIn: TEN_MINUTES,
    keyid: apiKey,
  });

  const metadata = new grpc.Metadata();
  metadata.add('authorization', `Bearer ${token}`);

  return metadata;
}

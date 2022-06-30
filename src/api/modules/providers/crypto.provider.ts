import * as argon from 'argon2';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class CryptoProvider {
  async encodePass({
    password,
  }): Promise<string> {
    return await argon.hash(password);
  }

  async verifyPass(
    userPass: string,
    dtoPass: string,
  ): Promise<boolean> {
    const pwMatches = await argon.verify(
      dtoPass,
      userPass,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Password do not match',
      );

    return pwMatches;
  }

  generateHash(): string {
    return crypto
      .pseudoRandomBytes(20)
      .toString('hex');
  }
}

import argon2 from 'argon2';
import crypto from 'node:crypto';

export interface Password {
  value: string;
  salt: string;
  algorithm: string;
  validate(password: string): Promise<boolean>;
}

export class PlainPassword implements Password {
  algorithm: string;

  constructor(readonly value: string, readonly salt: string) {
    this.algorithm = 'plain';
  }

  static create(password: string) {
    return new PlainPassword(password, '');
  }

  static restore(password: string, salt: string) {
    return new PlainPassword(password, salt);
  }

  async validate(password: string): Promise<boolean> {
    return this.value === password;
  }
}

export class SHA1Password implements Password {
  algorithm: string;

  constructor(readonly value: string, readonly salt: string) {
    this.algorithm = 'sha1';
  }

  static create(password: string) {
    const value = crypto.createHash('sha1').update(password).digest('hex');
    return new SHA1Password(value, '');
  }

  static restore(password: string, salt: string) {
    return new SHA1Password(password, salt);
  }

  async validate(password: string): Promise<boolean> {
    const value = crypto.createHash('sha1').update(password).digest('hex');
    return this.value === value;
  }
}

export class PBKDF2Password implements Password {
  algorithm: string;

  constructor(readonly value: string, readonly salt: string) {
    this.algorithm = 'pbkdf2';
  }

  static create(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const value = crypto
      .pbkdf2Sync(password, salt, 1000, 256, 'sha512')
      .toString('hex');
    return new PBKDF2Password(value, salt);
  }

  static restore(password: string, salt: string) {
    return new PBKDF2Password(password, salt);
  }

  async validate(password: string): Promise<boolean> {
    const value = crypto
      .pbkdf2Sync(password, this.salt, 1000, 256, 'sha512')
      .toString('hex');
    return this.value === value;
  }
}

export class Argon2Password implements Password {
  algorithm: string;

  constructor(readonly value: string, readonly salt: string) {
    this.algorithm = 'argon2';
  }

  static async create(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const value = await argon2.hash(password, {
      type: argon2.argon2id,
      salt: Buffer.from(salt),
      secret: Buffer.from('secret'),
    });
    return new Argon2Password(value, salt);
  }

  static restore(password: string, salt: string) {
    return new Argon2Password(password, salt);
  }

  async validate(password: string): Promise<boolean> {
    return argon2.verify(this.value, password, {
      type: argon2.argon2id,
      salt: Buffer.from(this.salt),
      secret: Buffer.from('secret'),
    });
  }
}

export class PasswordFactory {
  static create(algorithm: string) {
    if (algorithm === 'plain') return PlainPassword;
    if (algorithm === 'sha1') return SHA1Password;
    if (algorithm === 'pbkdf2') return PBKDF2Password;
    if (algorithm === 'argon2') return Argon2Password;
    throw new Error('');
  }
}

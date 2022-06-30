export enum key {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  JWT_SECRET = 'JWT_SECRET',
  JWT = 'jwt',
  PERMISSIONS = 'permissions',
  LOCAL = 'local',
  IS_PUBLIC = 'isPublic',
  ACCESS_TOKEN_EXPIRATION = '15m',
  REFRESH_TOKEN_EXPIRATION = '7d',
}

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

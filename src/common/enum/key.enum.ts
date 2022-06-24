export enum key {
  JWT_SECRET = 'JWT_SECRET',
  JWT = 'jwt',
  ROLES = 'ROLES',
  LOCAL = 'local',
  IS_PUBLIC = 'isPublic',
  ACCESS_TOKEN_EXPIRATION = '15m',
  REFRESH_TOKEN_EXPIRATION = '7d',
}

export enum AbilityAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

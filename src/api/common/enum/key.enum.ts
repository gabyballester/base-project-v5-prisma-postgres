export enum key {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
  jwt_secret = 'JWT_SECRET',
  jwt = 'jwt',
  permissions = 'permissions',
  local = 'local',
  is_public = 'isPublic',
  access_token_exp = '15m',
  refresh_token_exp = '7d',
  roles = 'roles',
}

export enum Action {
  manage = 'manage',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

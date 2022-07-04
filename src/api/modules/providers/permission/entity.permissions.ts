export const permConfig = {
  user: {
    superadmin: {
      any: true,
    },
    admin: {
      any: false,
      create: true,
      read: true,
      update: {
        all: true,
      },
      delete: {
        all: false,
        own: true,
      },
    },
    user: {
      any: false,
      create: false,
      read: true,
      update: {
        all: false,
        own: true,
      },
      delete: {
        all: false,
        own: true,
      },
    },
  },
};

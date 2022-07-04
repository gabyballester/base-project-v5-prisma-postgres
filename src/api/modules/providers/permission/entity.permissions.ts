export const permConfig = {
  user: {
    superadmin: {
      manage: true,
    },
    admin: {
      manage: false,
      create: {
        all: true,
        own: null,
      },
      read: {
        all: true,
        own: null,
      },
      update: {
        all: true,
        own: null,
      },
      delete: {
        all: false,
        own: true,
      },
    },
    user: {
      manage: false,
      create: false,
      read: {
        all: true,
        own: null,
      },
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

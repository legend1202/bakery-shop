const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  BRANCH: '/branch',
  PRODUCT: '/product',
  SUPPLY: '/supply',
  SALE: '/sale',
  ATTENDANCE: '/attendance',
  MNG: '/mng',
  INVENTORY: '/inventory',
  REPORT: '/report',
  SHIFT: '/shift',
};

// ----------------------------------------------------------------------

export const paths = {
  home: '/',
  page403: '/403',
  page404: '/404',
  page500: '/500',

  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
  },

  admin: {
    root: `${ROOTS.ADMIN}`,
    users: {
      root: `${ROOTS.ADMIN}/users`,
      create: `${ROOTS.ADMIN}/users/create`,
      list: `${ROOTS.ADMIN}/users/list`,
    },
  },
  branches: {
    root: `${ROOTS.BRANCH}`,
    create: `${ROOTS.BRANCH}/create`,
    list: `${ROOTS.BRANCH}/list`,
  },
  product: {
    root: `${ROOTS.PRODUCT}`,
    create: `${ROOTS.PRODUCT}/create`,
    list: `${ROOTS.PRODUCT}/list`,
  },
  supplies: {
    root: `${ROOTS.SUPPLY}`,
    create: `${ROOTS.SUPPLY}/create`,
    list: `${ROOTS.SUPPLY}/list`,
  },

  inventory: {
    root: `${ROOTS.INVENTORY}`,
    product: {
      root: `${ROOTS.INVENTORY}/product`,
      list: `${ROOTS.INVENTORY}/product/list`,
    },
    supply: {
      root: `${ROOTS.INVENTORY}/supply`,
      list: `${ROOTS.INVENTORY}/supply/list`,
    },
  },
  mng: {
    root: `${ROOTS.MNG}`,
    product: {
      root: `${ROOTS.MNG}/product`,
      create: `${ROOTS.MNG}/product/create`,
      list: `${ROOTS.SUPPLY}/product/list`,
    },
    customOrder: {
      root: `${ROOTS.MNG}/custom_order`,
      create: `${ROOTS.MNG}/custom_order/create`,
      list: `${ROOTS.SUPPLY}/custom_order/list`,
    },
    supply: {
      root: `${ROOTS.MNG}/supply`,
      create: `${ROOTS.MNG}/supply/create`,
      list: `${ROOTS.SUPPLY}/supply/list`,
    },
  },
  sale: {
    root: `${ROOTS.SALE}`,
    create: `${ROOTS.SALE}/create`,
    purchase: `${ROOTS.SALE}/purchase`,
    list: `${ROOTS.SALE}/list`,
  },
  attendance: {
    root: `${ROOTS.ATTENDANCE}`,
    create: `${ROOTS.ATTENDANCE}/create`,
    list: `${ROOTS.ATTENDANCE}/list`,
  },
  report: {
    root: `${ROOTS.REPORT}`,
    product: `${ROOTS.REPORT}/product`,
    customproduct: `${ROOTS.REPORT}/customproduct`,
    supply: `${ROOTS.REPORT}/supply`,
    sale: `${ROOTS.REPORT}/sale`,
    attendance: `${ROOTS.REPORT}/attendance`,
  },
  shift: {
    root: `${ROOTS.SHIFT}`,
    create: `${ROOTS.SHIFT}/create`,
    list: `${ROOTS.SHIFT}/list`,
  },
};

/* eslint-disable key-spacing */

/**
 * Role permissions enum
 * Shared between client and server side code base
 */
const Roles = {
  siteAdmin: '2',
  admin:     '1',
  user:      '0',

  // eslint-disable-next-line object-shorthand
  map: () => {
    return [
      { value: Roles.user },
      { value: Roles.admin },
      { value: Roles.siteAdmin }
    ];
  },

  isValidRole: (role) => {
    let valid = false;
    Roles.map().forEach((item) => {
      if (item.value === role) valid = true;
    });
    return valid;
  }
};

module.exports = Roles;

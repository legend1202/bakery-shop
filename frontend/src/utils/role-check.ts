export function isAdminFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === 'ADMIN') {
    isAdmin = true;
  }

  return isAdmin;
}

export function isSuperAdminFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === 'SUPERADMIN') {
    isAdmin = true;
  }

  return isAdmin;
}

export function isSalePersonFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === 'SALESPERSON') {
    isAdmin = true;
  }

  return isAdmin;
}

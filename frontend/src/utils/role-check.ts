export function isAdminFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === "ADMIN") {
    isAdmin = true;
  }

  return isAdmin;
}

export function isFellesraadFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === "FELLESRAAD") {
    isAdmin = true;
  }

  return isAdmin;
}

export function isCompanyFn(inputValue: string) {
  let isAdmin = false;
  if (inputValue === "COMPANY") {
    isAdmin = true;
  }

  return isAdmin;
}

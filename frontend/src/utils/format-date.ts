type InputValue = Date;

export function fDate(inputValue: InputValue) {
  //   const day = ("0" + inputValue.getDate()).slice(-2);
  //   const month = ("0" + (inputValue.getMonth() + 1)).slice(-2);

  const day = `0${inputValue.getDate()}`.slice(-2);
  const month = `0${inputValue.getMonth() + 1}`.slice(-2);

  const year = inputValue.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

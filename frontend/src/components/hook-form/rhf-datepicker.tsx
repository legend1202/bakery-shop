import parseISO from "date-fns/parseISO";
import { Controller, useFormContext } from "react-hook-form";

import { DatePicker } from "@mui/x-date-pickers";
import { TextFieldProps } from "@mui/material/TextField";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  label: string;
  defaultValue: string;
};

export default function RHFDatePicker({ name, label, defaultValue }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={parseISO(defaultValue)}
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  );
}

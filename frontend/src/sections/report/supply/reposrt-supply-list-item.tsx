import { Stack } from '@mui/system';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fmDate } from 'src/utils/format-time';

import Label from 'src/components/label/label';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellSupply({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.supplyDetails.name}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellQuantity({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={Math.abs(params.row.quantity)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellCreated({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fmDate(params.row.createdAt)}
      secondary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

const getStatusText = (status?: number, quantity?: number) => {
  if (!status) {
    return 'Pendiente';
  }
  if (status) {
    if (quantity && quantity > 0) {
      return 'Almacenado';
    }
  }
  return 'Usado';
};

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={(params.row.status && 'success') || (!params.row.status && 'default') || 'default'}
      >
        {getStatusText(params.row.status, params.row.quantity)}
      </Label>
    </Stack>
  );
}

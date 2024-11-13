import { Stack } from '@mui/system';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label/label';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellBranch({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row?.branchDetails?.name || ''}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}
export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.productDetails.name}
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

export function RenderCellPrice({ params }: ParamsProps) {
  const { productDetails, quantity, price } = params.row;

  let orderPrice = 0;

  if (price) {
    orderPrice = price;
    /* orderPrice = -quantity * (productDetails?.price ? productDetails?.price : 0); */
  } else if (productDetails?.price !== undefined && productDetails?.price !== null) {
    orderPrice = quantity * productDetails.price;
  }
  return (
    <ListItemText
      primary={Math.abs(orderPrice)}
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
  if (status === 0) {
    return 'Pendiente';
  }
  if (status === 1) {
    if (quantity && quantity > 0) {
      return 'Almacenada';
    }
    if (quantity && quantity < 0) {
      return 'Entregada';
    }
  }
  return 'Cancelada';
};

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={
          (params.row.status === 1 && 'success') ||
          (params.row.status === 2 && 'warning') ||
          (params.row.status === 0 && 'default') ||
          'default'
        }
      >
        {getStatusText(params.row.status, params.row.quantity)}
      </Label>
    </Stack>
  );
}

export function RenderCellCreated({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
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

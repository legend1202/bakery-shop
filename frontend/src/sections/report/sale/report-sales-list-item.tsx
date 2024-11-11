import { Button } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

type ParamsProps = {
  params: GridCellParams;
};

type SaleParamsProps = {
  params: GridCellParams;
  handleOpenDialog: (saleId: string) => void;
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
export function RenderCellSaleId({ params, handleOpenDialog }: SaleParamsProps) {
  return (
    <Button onClick={() => handleOpenDialog(params.row.id)} style={{ cursor: 'pointer' }}>
      <ListItemText
        primary={params.row.id}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </Button>
  );
}

export function RenderCellTotal({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={Math.abs(params.row.total)}
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

export function RenderCellProductName({ params }: ParamsProps) {
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

export function RenderCellProductQuantity({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.quantity}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellProductUnitPrice({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.productDetails.price}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellProductTotal({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.productDetails.price * params.row.quantity}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

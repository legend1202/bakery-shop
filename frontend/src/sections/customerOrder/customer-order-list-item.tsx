import { Stack } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import Label from 'src/components/label/label';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellBranch({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.branchDetails.name}
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

export function RenderCellAmount({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={-params.row.quantity}
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
  return (
    <ListItemText
      primary={params.row.price}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellAddress({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.address}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellDeliverDate({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.deliverDate}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellStatus({ params }: ParamsProps) {
  const getStatusText = (status: number) => {
    if (status === 0) {
      return 'Pending';
    }
    if (status === 1) {
      return 'Delivered';
    }
    return 'Cancelled';
  };

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
        {getStatusText(params.row.status)}
      </Label>
    </Stack>
  );
}

export function RenderCellBio({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.bio}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

import { Stack } from '@mui/system';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { getQuantityBySupplyId } from 'src/utils/product';

import Label from 'src/components/label/label';

import { ISupplyCount } from 'src/types/product';

type ParamsProps = {
  params: GridCellParams;
};

type ParamsCountProps = {
  params: GridCellParams;
  supplyCount: ISupplyCount[];
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

export function RenderCellAmount({ params, supplyCount }: ParamsCountProps) {
  const totolQuantity = getQuantityBySupplyId(supplyCount, params.row.supplyId);

  const getQuantityStatus = totolQuantity && -params.row.quantity <= totolQuantity;

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={
          (params.row.status && 'default') ||
          (getQuantityStatus && 'success') ||
          (getQuantityStatus && 'warning') ||
          'warning'
        }
      >
        {-params.row.quantity}
      </Label>
    </Stack>
  );
}

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.status ? 'Accept' : 'Pending'}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
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

export function RenderCellDate({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

type ParamsProps = {
  params: GridCellParams;
};

type CreateAtParamsProps = {
  params: GridCellParams;
  lastRowId: string;
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

export function RenderCellAmount({ params, lastRowId }: CreateAtParamsProps) {
  return (
    <ListItemText
      primary={
        lastRowId === params.row.id ? `${-params.row.quantity} (Último uso)` : -params.row.quantity
      }
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
  return (
    <ListItemText
      primary={params.row.status ? 'Usada' : 'Pendiente'}
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

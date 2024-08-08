import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.suppliesDetails.name}
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
      primary={params.row.amount}
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

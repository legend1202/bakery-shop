import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellAttendDate({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.createdAt}
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

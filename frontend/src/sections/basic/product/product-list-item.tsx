import { Stack, Avatar } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

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

export function RenderCellName({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row?.imageUrls && params.row?.imageUrls[0]}
        variant="rounded"
        sx={{ width: 24, height: 24, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={params.row.name}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
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

export function RenderCellCode({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.code}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellSize({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.size}
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

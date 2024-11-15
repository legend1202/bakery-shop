import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

type ParamsProps = {
  params: GridCellParams;
};

type ParamsPropsBranchName = {
  params: GridCellParams;
  handleShowDetailDialog: (branchId: string) => void;
};

export function RenderCellName({ params, handleShowDetailDialog }: ParamsPropsBranchName) {
  const handleSetBranchId = (branchId: string) => {
    handleShowDetailDialog(branchId);
  };
  return (
    <Button onClick={() => handleSetBranchId(params.row.id)} style={{ cursor: 'pointer' }}>
      <ListItemText
        primary={params.row.name}
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

export function RenderCellLocation({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.location}
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
    <Box sx={{ bgcolor: params.row.bio || 'lightcoral', p: 1, borderRadius: 1 }}>
      <ListItemText
        primary=""
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </Box>
  );
}
export function RenderCellEmployeeName({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={`${params.row.firstName} ${params.row.lastName}`}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellEmployeeRole({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.role}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}
export function RenderCellEmployeeEmail({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.email}
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
      primary={params.row.totalQuantity}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellProductCode({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.productDetails.code}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellProductSize({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.productDetails.size}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

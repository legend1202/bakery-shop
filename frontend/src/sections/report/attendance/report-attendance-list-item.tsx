import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

type ParamsProps = {
  params: GridCellParams;
};

type ParamsPropsName = {
  params: GridCellParams;
  handleShowDetailDialog: (userId: string) => void;
};

export function RenderCellName({ params, handleShowDetailDialog }: ParamsPropsName) {
  return (
    <ListItemText
      onClick={() => handleShowDetailDialog(params.row.userId)}
      primary={params.row?.userName || ''}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}
export function RenderCellBranch({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.branchName}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellPayroll({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={Math.abs(params.row.count)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

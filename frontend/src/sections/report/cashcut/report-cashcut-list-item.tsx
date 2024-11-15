import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { ICashcutData } from 'src/types/cashcut';

type ParamsProps = {
  params: GridCellParams;
};

type ParamsPropsName = {
  params: GridCellParams;
  handleShowDetailDialog: (cashcut?: ICashcutData) => void;
};

export function RenderCellBranch({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.branchDetails[0].name}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellTotal({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.totalSales || 0}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellCashcut({ params, handleShowDetailDialog }: ParamsPropsName) {
  return (
    <ListItemText
      onClick={() => handleShowDetailDialog(params.row)}
      primary={params.row.cashcutData[0]?.total || 0}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

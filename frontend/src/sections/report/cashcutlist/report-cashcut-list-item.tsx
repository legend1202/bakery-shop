import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellSaleDate({ params }: ParamsProps) {
  const router = useRouter();
  const handleCashcutDetails = () => {
    router.push(paths.report.cashcutlist_details(params.row.saleDate));
  };
  return (
    <ListItemText
      onClick={() => handleCashcutDetails()}
      primary={params.row.saleDate}
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

export function RenderCellCashcut({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.totalCashcut || 0}
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

export function RenderCellCashcutDetail({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.cashcutData[0].total || 0}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

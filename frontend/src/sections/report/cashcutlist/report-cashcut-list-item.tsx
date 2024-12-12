import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fTime } from 'src/utils/format-time';

type ParamsProps = {
  params: GridCellParams;
};

type ParamsBranchProps = {
  params: GridCellParams;
  handleShowDetailDialog: (branchId: string) => void;
};

export function RenderCellSaleDate({ params }: ParamsProps) {
  const router = useRouter();
  const handleCashcutDetails = () => {
    router.push(paths.report.cashcutlist_details(params.row._id));
  };
  return (
    <ListItemText
      onClick={() => handleCashcutDetails()}
      primary={params.row._id}
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
  const sale = params.row.totalSale || 0;
  const order = params.row.totalOrder || 0;
  return (
    <ListItemText
      primary={sale + order}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellTotalSale({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.totalSale || 0}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellTotaloRder({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.totalOrder || 0}
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

export function RenderCellBranch({ params, handleShowDetailDialog }: ParamsBranchProps) {
  return (
    <ListItemText
      onClick={() => handleShowDetailDialog(params.row?.branchDetails[0]?.id)}
      primary={params.row?.branchDetails[0]?.name || ''}
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

export function RenderCellSaleId({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.id}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellSaleTotal({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={Math.abs(params.row.total)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellCreated({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

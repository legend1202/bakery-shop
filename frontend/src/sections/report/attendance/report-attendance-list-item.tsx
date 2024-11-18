import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fmDate } from 'src/utils/format-time';
import { calWorkHours } from 'src/utils/attendanceTimeValidator';

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
      primary={params.row.count.toFixed(1)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellAttendaceDate({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fmDate(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellShiftStart({ params }: ParamsProps) {
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

export function RenderCellShiftEnd({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fTime(params.row.updatedAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellShiftPeriod({ params }: ParamsProps) {
  const differenceInHours = calWorkHours(params.row.createdAt, params.row.updatedAt);

  return (
    <ListItemText
      primary={differenceInHours.toFixed(1)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { ResultItem } from 'src/types/attendance';

// ----------------------------------------------------------------------

type Props = {
  row: ResultItem;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function AttendanceTableRow({ row, selected, onSelectRow }: Props) {
  const { userName, branchName, count } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap>
              {userName}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap>
              {branchName}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={count}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
    </TableRow>
  );
}

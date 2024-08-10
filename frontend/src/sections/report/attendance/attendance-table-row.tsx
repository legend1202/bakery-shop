import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { ITAttendance } from 'src/types/attendance';

// ----------------------------------------------------------------------

type Props = {
  row: ITAttendance;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function AttendanceTableRow({ row, selected, onSelectRow }: Props) {
  const { userDetails, bio, createdAt } = row;

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
              {userDetails?.firstName}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap>
              {userDetails?.lastName}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>{createdAt}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(createdAt)}
          secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>Sold</TableCell>

      <TableCell align="center">{bio}</TableCell>
    </TableRow>
  );
}

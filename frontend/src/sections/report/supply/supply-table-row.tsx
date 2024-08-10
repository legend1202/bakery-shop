import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { IMSupply } from 'src/types/supply';

// ----------------------------------------------------------------------

type Props = {
  row: IMSupply;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function SupplyTableRow({ row, selected, onSelectRow }: Props) {
  const { supplyDetails, branchDetails, quantity, status, bio, createdAt } = row;

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
              {supplyDetails?.name}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap>
              {branchDetails?.name}
            </Typography>
          }
        />
      </TableCell>

      <TableCell>{quantity}</TableCell>

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

      <TableCell>{status ? 'Confirmed' : 'Pending'}</TableCell>

      <TableCell align="center">{bio}</TableCell>
    </TableRow>
  );
}

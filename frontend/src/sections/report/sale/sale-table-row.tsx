import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { ISale } from 'src/types/sale';

// ----------------------------------------------------------------------

type Props = {
  row: ISale;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function SaleTableRow({ row, selected, onSelectRow }: Props) {
  const { productDetails, branchDetails, quantity, price, createdAt } = row;

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
              {productDetails?.name}
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

      <TableCell>{price}</TableCell>

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

      {/* <TableCell align="center">{bio}</TableCell> */}
    </TableRow>
  );
}

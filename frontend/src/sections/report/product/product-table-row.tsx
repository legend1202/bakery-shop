import { Stack } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import Label from 'src/components/label/label';

import { IMProduct } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  row: IMProduct;
  selected: boolean;
  onSelectRow: VoidFunction;
};

const getStatusText = (status?: number, quantity?: number) => {
  if (status === 0) {
    return 'Pending';
  }
  if (status === 1) {
    if (quantity && quantity > 0) {
      return 'Stored';
    }
    if (quantity && quantity < 0) {
      return 'Delivered';
    }
  }
  return 'Cancelled';
};

export default function ProductTableRow({ row, selected, onSelectRow }: Props) {
  const { productDetails, branchDetails, quantity, price, status, bio } = row;

  let orderPrice = 0;

  if (price) {
    orderPrice = price;
    /* orderPrice = -quantity * (productDetails?.price ? productDetails?.price : 0); */
  } else if (productDetails?.price !== undefined && productDetails?.price !== null) {
    orderPrice = quantity * productDetails.price;
  }

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

      <TableCell>{Math.abs(quantity)}</TableCell>
      <TableCell>{Math.abs(orderPrice)}</TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
          <Label
            variant="soft"
            color={
              (status === 1 && 'success') ||
              (status === 2 && 'warning') ||
              (status === 0 && 'default') ||
              'default'
            }
          >
            {getStatusText(status, quantity)}
          </Label>
        </Stack>
      </TableCell>

      <TableCell align="center">{bio}</TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

export type ICheckoutItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type ICheckoutValue = {
  total: number;
  subTotal?: number;
  discount?: number;
  totalItems: number;
  items: ICheckoutItem[];
};

export type CheckoutContextProps = ICheckoutValue & {
  //
  onAddToCart: (newItem: Omit<ICheckoutItem, 'subTotal'>) => void;
  onDeleteCart: (itemId: string) => void;
  //
  //
  onApplyDiscount: (discount: number) => void;
  //
  canReset: boolean;
  onReset: VoidFunction;
};

import { useMemo, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { ICheckoutItem } from 'src/types/checkout';

import { CheckoutContext } from './checkout-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout';

const initialState = {
  items: [],
  totalItems: 0,
  total: 0,
  subTotal: 0,
  discount: 0,
};

type Props = {
  children: React.ReactNode;
};

export function CheckoutProvider({ children }: Props) {
  const router = useRouter();

  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  const onGetCart = useCallback(() => {
    const totalItems: number = state.items.reduce(
      (total: number, item: ICheckoutItem) => total + item.quantity,
      0
    );

    const subTotal: number = state.items.reduce(
      (total: number, item: ICheckoutItem) => total + item.price,
      0
    );

    update('subTotal', subTotal);
    update('totalItems', totalItems);
    update('discount', state.items.length ? state.discount : 0);
    update('total', state.subTotal - state.discount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items, state.discount, state.subTotal]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);

    if (restored) {
      onGetCart();
    }
  }, [onGetCart]);

  const onAddToCart = useCallback(
    (newItem: ICheckoutItem) => {
      const updatedItems: ICheckoutItem[] = state.items.map((item: ICheckoutItem) => {
        if (item.productId === newItem.productId) {
          return {
            ...newItem,
          };
        }
        return item;
      });

      if (!updatedItems.some((item: ICheckoutItem) => item.productId === newItem.productId)) {
        updatedItems.push(newItem);
      }

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDeleteCart = useCallback(
    (itemId: string) => {
      const updatedItems = state.items.filter((item: ICheckoutItem) => item.productId !== itemId);

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onApplyDiscount = useCallback(
    (discount: number) => {
      update('discount', discount);
    },
    [update]
  );
  // Reset
  const onReset = useCallback(() => {
      reset();
      router.replace(paths.sale.purchase);
  }, [reset, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      //
      onAddToCart,
      onDeleteCart,
      //
      onApplyDiscount,
      //
      onReset,
    }),
    [
      onAddToCart,
      onApplyDiscount,
      onDeleteCart,
      onReset,
      state,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

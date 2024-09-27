import { IMSupply } from 'src/types/supply';
import { IMProduct, ISupplyCount, IProductCount } from 'src/types/product';

export const getQuantityByProductId = (
  summedProducts: IProductCount[],
  productId: string
): number | undefined => {
  const product = summedProducts.find((p) => p.productId === productId);
  return product ? product.quantity : 0; // Returns quantity if found, otherwise undefined
};

export const getQuantityBySupplyId = (
  summedSupplies: ISupplyCount[],
  supplyId: string
): number | undefined => {
  const product = summedSupplies.find((p) => p.supplyId === supplyId);
  return product ? product.quantity : 0; // Returns quantity if found, otherwise undefined
};

export const sumByProductId = (productsValue: IMProduct[]) => {
  const result = productsValue.reduce((acc, product) => {
    if (product.status === 1) {
      const existingProduct = acc.find((p) => p.productId === product.productId);

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        acc.push({
          productId: product.productId,
          quantity: product.quantity,
        });
      }
    }
    return acc;
  }, [] as IProductCount[]);

  return result;
};

export const sumBySupplyId = (supplyValue: IMSupply[]) => {
  const result = supplyValue.reduce((acc, supply) => {
    if (supply.status) {
      const existingProduct = acc.find((p) => p.supplyId === supply.supplyId);

      if (existingProduct) {
        existingProduct.quantity += supply.quantity;
      } else {
        acc.push({
          supplyId: supply.supplyId,
          quantity: supply.quantity,
        });
      }
    }
    return acc;
  }, [] as ISupplyCount[]);

  return result;
};

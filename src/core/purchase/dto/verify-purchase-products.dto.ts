import { PurchaseProductDto } from '../../purchase-product/dto/purchase-product.dto';

export class VerifyPurchaseProductsDto {
  products: PurchaseProductDto[];
  price: number;
}

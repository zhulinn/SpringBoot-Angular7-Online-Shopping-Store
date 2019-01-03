import {ProductInOrder} from "./ProductInOrder";

export class ProductInfo {
    productId: string;
    productName: string;
    productPrice: number;
    productStock: number;
    productDescription: string;
    productIcon: string;
    productStatus: number; // 0: onsale 1: offsale
    categoryType: number;
    createTime: string;
    updateTime: string;


    constructor(productInOrder: ProductInOrder) {
        this.productId = productInOrder.productId;
        this.productName = productInOrder.productName;
        this.productPrice = productInOrder.productPrice;
        this.productStock = productInOrder.productStock;
        this.productDescription = productInOrder.productDescription;
        this.productIcon = productInOrder.productIcon;
        this.categoryType = productInOrder.categoryType;
    }
}


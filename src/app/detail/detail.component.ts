import {Component, OnInit} from '@angular/core';
import {ProductService} from '../shared/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../shared/services/cart.service';
import {CookieService} from "ngx-cookie-service";
import {ProductInOrder} from "../shared/models/ProductInOrder";
import {ProductInfo} from "../shared/models/productInfo";


@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {


    title: string;
    quantity: number;
    productInfo: ProductInfo;

    constructor(private productService: ProductService,
                private cartService: CartService,
                private cookieService: CookieService,
                private route: ActivatedRoute,
                private router: Router) {
    }


    ngOnInit() {
        this.getProduct();
        this.title = 'Product Detail';
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //   // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //   // Add '${implements OnChanges}' to the class.
    //   console.log(changes);
    //   if (this.item.quantity in changes) {

    //   }
    // }

    getProduct(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.productService.getDetail(id)
            .subscribe(prod => {
                this.productInfo = prod;
            });
    }

    addToCart() {
        this.cartService.addItem(new ProductInOrder(this.productInfo, this.quantity));

        this.router.navigateByUrl('/cart');
    }


    validateCount(productInOrder) {
        const max = productInOrder.productStock;
        if (productInOrder.productQuantity > max) {
            productInOrder.productQuantity = max;
        } else if (productInOrder.productQuantity < 1) {
            productInOrder.productQuantity = 1;
        }
    }
}


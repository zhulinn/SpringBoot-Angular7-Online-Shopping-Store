import {Component, OnInit} from '@angular/core';
import {ProductInfo} from '../shared/models/productInfo';
import {ProductService} from '../shared/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../shared/services/cart.service';
import {CookieService} from "ngx-cookie-service";
import {Item} from "../shared/models/Item";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

    productInfo: ProductInfo;
    title: string;
    item: Item;

    constructor(private productService: ProductService,
                private cartService: CartService,
                private cookieService: CookieService,
                private route: ActivatedRoute,
                private router: Router) {
        this.item = new Item();
        this.item.quantity = 1;
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
                this.item.productInfo = this.productInfo;
            });
    }

    addToCart() {
        this.cartService.addItem(this.item);

        this.router.navigateByUrl('/cart');
    }
}


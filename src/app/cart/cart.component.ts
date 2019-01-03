import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../shared/services/cart.service';
import {Subject, Subscription} from "rxjs";
import {UserService} from "../shared/services/user.service";
import {JwtResponse} from "../shared/response/JwtResponse";
import {ProductInOrder} from "../shared/models/ProductInOrder";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {


    map: any;
    title: string;

    itemsSubscription: Subscription;
    productInOrders: ProductInOrder[];

    totalSubscription: Subscription;
    total: number;
    currentUser: JwtResponse;
    userSubscription: Subscription;

    private updateTerms = new Subject<ProductInOrder>();

    constructor(private cartService: CartService,
                private userService: UserService
    ) {

        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    ngOnInit() {
        this.cartService.getCart();
        this.title = 'My Cart';

        this.updateTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged((p, q) => p.count == q.count),

            // switch to new search observable each time the term changes
            switchMap((productInOrder: ProductInOrder) => this.cartService.update(productInOrder))
        );
    }

    ngOnDestroy() {
        if (!this.currentUser) {
            this.cartService.storeLocalCart();
        }
        this.userSubscription.unsubscribe();
    }

    addOne(productInOrder) {
        productInOrder.count++;
        CartComponent.validateCount(productInOrder);
        this.updateTerms.next(productInOrder);
    }

    minusOne(productInOrder) {
        productInOrder.count--;
        CartComponent.validateCount(productInOrder);
        this.updateTerms.next(productInOrder);
    }

    onChange(productInOrder) {
        CartComponent.validateCount(productInOrder);
        this.updateTerms.next(productInOrder);
    }


    remove(productInOrders, productInOrder) {
        this.cartService.remove(productInOrders, productInOrder);
    }


    static validateCount(productInOrder) {
        const max = productInOrder.productStock;
        if (productInOrder.count > max) {
            productInOrder.count = max;
        } else if (productInOrder.count < 1) {
            productInOrder.count = 1;
        }
    }
    checkout() {

    }
}


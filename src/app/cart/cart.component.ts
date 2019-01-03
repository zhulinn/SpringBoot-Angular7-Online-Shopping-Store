import {AfterContentChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../shared/services/cart.service';
import {Subject, Subscription} from 'rxjs';
import {UserService} from '../shared/services/user.service';
import {JwtResponse} from '../shared/response/JwtResponse';
import {ProductInOrder} from '../shared/models/ProductInOrder';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy, AfterContentChecked {

    constructor(private cartService: CartService,
                private userService: UserService) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    productInOrders = [];
    total = 0;
    currentUser: JwtResponse;
    userSubscription: Subscription;

    private updateTerms = new Subject<ProductInOrder>();


    static validateCount(productInOrder) {
        const max = productInOrder.productStock;
        if (productInOrder.count > max) {
            productInOrder.count = max;
        } else if (productInOrder.count < 1) {
            productInOrder.count = 1;
        }
    }

    ngOnInit() {
        this.cartService.getCart().subscribe(prods => {
            this.productInOrders = prods;
        });
        this.updateTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            //
            // ignore new term if same as previous term
            // Same Object Reference, not working here
            //  distinctUntilChanged((p: ProductInOrder, q: ProductInOrder) => p.count === q.count),
            //
            // switch to new search observable each time the term changes
            switchMap((productInOrder: ProductInOrder) => this.cartService.update(productInOrder))
        ).subscribe(prods => {
                if (!prods) throw new Error();
            },
            _ => console.log("Update Item Failed"));
    }

    ngOnDestroy() {
        if (!this.currentUser) {
            this.cartService.storeLocalCart();
        }
        this.userSubscription.unsubscribe();
    }

    ngAfterContentChecked() {
        this.total = this.productInOrders.reduce(
            (prev, cur) => prev + cur.count * cur.productPrice, 0);
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
        this.cartService.remove(productInOrders, productInOrder).subscribe(
            prods => this.productInOrders = prods,
            _ => console.log('Remove Cart Failed'));
    }

    checkout() {
        this.cartService.checkout().subscribe(
            _ => {
                this.productInOrders = [];
            },
            error1 => {
                console.log('Checkout Cart Failed')
            });
    }
}


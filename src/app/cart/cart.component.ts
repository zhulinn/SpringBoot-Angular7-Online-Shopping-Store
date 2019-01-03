import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../shared/services/cart.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from "rxjs";
import {Item} from "../shared/models/Item";
import {UserService} from "../shared/user.service";
import {JwtResponse} from "../shared/response/JwtResponse";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {


    map: any;
    title: string;

    itemsSubscribtion: Subscription;
    items: Item[];

    totalSubscribtion: Subscription;
    total: number;
    currentUser: JwtResponse;
    userSubscribtion: Subscription;

    constructor(private cartService: CartService,
                private userService: UserService,
                private router: Router,
                private location: Location) {
        this.itemsSubscribtion = this.cartService.items.subscribe(items => {
            this.items = items;
        });
        this.totalSubscribtion = this.cartService.total.subscribe(total => this.total = total);
        this.userSubscribtion = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    ngOnInit() {
        this.cartService.getCart();
        this.title = 'My Cart';
    }

    ngOnDestroy() {
        if (!this.currentUser) {
            this.cartService.storeItems();
        }
        this.userSubscribtion.unsubscribe();
        this.itemsSubscribtion.unsubscribe();
        this.totalSubscribtion.unsubscribe();
    }

    minus(item) {
        this.cartService.minus(item);


    }


    plus(item) {
        this.cartService.plus(item);

    }

    change(item, updatedValue) {
        this.cartService.change(item, updatedValue);


    }

    remove(todo) {
        this.cartService.remove(todo);


    }

    checkout() {

    }
}


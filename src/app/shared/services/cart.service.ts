import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {apiUrl} from '../mockData';
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";
import {UserService} from "./user.service";
import {Cart} from "../models/Cart";
import {Item} from "../models/Item";
import {JwtResponse} from "../response/JwtResponse";
import {ProductInOrder} from "../models/ProductInOrder";

@Injectable({
    providedIn: 'root'
})
export class CartService {


    private cartUrl = `${apiUrl}/cart`;

    localMap = {};


    private itemsSubject: BehaviorSubject<Item[]>;
    private totalSubject: BehaviorSubject<number>;
    public items: Observable<Item[]>;
    public total: Observable<number>;


    private currentUser: JwtResponse;

    constructor(private http: HttpClient,
                private cookieService: CookieService,
                private userService: UserService) {
        this.itemsSubject = new BehaviorSubject<Item[]>(null);
        this.items = this.itemsSubject.asObservable();
        this.totalSubject = new BehaviorSubject<number>(null);
        this.total = this.totalSubject.asObservable();
        this.userService.currentUser.subscribe(user => this.currentUser = user);


    }

    private getLocalCart(): ProductInOrder[] {
        if (this.cookieService.check('cart')) {
            this.localMap = JSON.parse(this.cookieService.get('cart'));
            return Object.values(this.localMap);
        } else {
            return [];
        }
    }

    getCart(): Observable<ProductInOrder[]> {
        let localCart = this.getLocalCart();
        if (this.currentUser) {
            this.clearLocalCart();
            return this.http.post<Cart>(this.cartUrl, localCart).pipe(
                tap(cart => console.log("Remote Cart: " + cart.products)),
                map(cart => cart.products),
            );
        } else {
            return of(localCart);
        }
    }

    addItem(productInOrder): Observable<any> {
        if (!this.currentUser) {
            // if un-login
            if (this.cookieService.check('cart')) {
                this.localMap = JSON.parse(this.cookieService.get('cart'));
            }
            if (!this.localMap[productInOrder.productId]) {
                this.localMap[productInOrder.productId] = productInOrder;
            } else {
                this.localMap[productInOrder.productId].count += productInOrder.count;
            }
            this.cookieService.set('cart', JSON.stringify(this.localMap));
            return of(null);
        } else {
            const url = `${this.cartUrl}/add`;
            return this.http.post(url, {
                "quantity": productInOrder.count,
                "productId": productInOrder.productId
            });
        }
    }

    update(productInOrder): Observable<any> {
        if (this.currentUser)  {
            const url = `${this.cartUrl}/${productInOrder.productId}`;
            return this.http.post<ProductInOrder>(url, productInOrder.productQuantity);
        }
    }


    remove(productInOrders, productInOrder): Observable<ProductInOrder[]> {
        if (!this.currentUser) {
            delete this.localMap[productInOrder.productId];
            return of(productInOrders.filter(e => e.productId != productInOrder.productId));
        } else {
            const url = `${this.cartUrl}/${productInOrder.productId}`;
            return this.http.delete<Cart>(url).pipe(
                map(cart => cart.products),
            )
        }
    }


    checkout() {

    }

    storeLocalCart() {
        this.cookieService.set('cart', JSON.stringify(this.localMap));
    }

    clearLocalCart() {
        this.cookieService.delete('cart');
        this.localMap = {};
    }

}

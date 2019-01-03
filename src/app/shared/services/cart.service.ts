import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {apiUrl} from '../mockData';
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {UserService} from "../user.service";
import {Cart} from "../models/Cart";
import {Item} from "../models/Item";
import {ProductInfo} from "../models/productInfo";
import {JwtResponse} from "../response/JwtResponse";
import {ProductInOrder} from "../models/ProductInOrder";

@Injectable({
    providedIn: 'root'
})
export class CartService {


    private cartUrl = `${apiUrl}/cart`;

    localMap = {};

    // map= {
//    id -> item
// }
    private itemsSubject: BehaviorSubject<Item[]>;
    private totalSubject: BehaviorSubject<number>;
    public items: Observable<Item[]>;
    public total: Observable<number>;

    // private localItems: Item[];

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

    getCart() {
        let tmp = this.getLocalCart();
        if (this.currentUser) {
            this.clearLocalCart();
            this.getRemoteCart(tmp).subscribe(merged => {
                if (merged != null) {
                    this.itemsSubject.next(merged);
                    console.log(merged);
                    this.totalSubject.next(merged.reduce((accum, cur) => (accum + cur.quantity * cur.productInfo.productPrice), 0));
                }
            });
        } else {
            this.itemsSubject.next(tmp);
            this.totalSubject.next(tmp.reduce((accum, cur) => (accum + cur.quantity * cur.productInfo.productPrice), 0));

        }
    }

    private getLocalCart(): Item[] {
        if (this.cookieService.get('cart') != '') {
            this.localMap = JSON.parse(this.cookieService.get('cart'));
            return Object.values(this.localMap);
        }
        return [];
    }

    private getRemoteCart(localItems): Observable<Item[]> {
        return this.http.post<Cart>(this.cartUrl, localItems).pipe(
            tap(cart => console.log("Remote Cart: " + cart)),
            map(cart => {
                console.log(cart);
                return cart.products.map(e => {
                    let item = new Item();
                    item.quantity = e.productQuantity;
                    item.productInfo = new ProductInfo(e);
                    return item;
                });
            }),
            catchError(this.handleError("Get Cart Failed", []))
        );
    }


    minus(item) {
        if (!this.currentUser) {
            if (item.quantity === 1) {
                return;
            }
            item.quantity--;
            this.totalSubject.next(this.totalSubject.value - item.productInfo.productPrice);
        } else {
            this.modify(item, item.quantity - 1);
        }

    }


    plus(item) {
        if (!this.currentUser) {
            if (item.quantity === item.productInfo.productStock) {
                return;
            }
            item.quantity++;
            this.totalSubject.next(this.totalSubject.value + item.productInfo.productPrice);
        } else {
            this.modify(item, item.quantity + 1);
        }

    }

    change(item, updatedValue) {
        if (isNaN(updatedValue)) return;
        const max = item.productInfo.productStock;
        if (updatedValue > max) {
            updatedValue = max;
        } else if (updatedValue < 1) {
            updatedValue = 1;
        }

        if (!this.currentUser) {
            this.totalSubject.next(this.totalSubject.value + (updatedValue - item.quantity) * item.productInfo.productPrice);
            item.quantity = updatedValue;
        } else {
            this.modify(item, updatedValue);
        }
    }

    remove(item) {
        if (!this.currentUser) {
            delete this.localMap[item.productInfo.productId];
            this.totalSubject.next(this.totalSubject.value - item.quantity * item.productInfo.productPrice);
            let tmp = this.itemsSubject.value.filter(e => {
                return e.productInfo.productId != item.productInfo.productId;
            });
            this.itemsSubject.next(tmp);
        } else {
            const url = `${this.cartUrl}/${item.productInfo.productId}`;
            this.http.delete<boolean>(url).subscribe(
                res => {
                    if (res) {
                        this.totalSubject.next(this.totalSubject.value - item.quantity * item.productInfo.productPrice);
                        let tmp = this.itemsSubject.value.filter(e => e.productInfo.productId != item.productInfo.productId);
                        this.itemsSubject.next(tmp);
                    } else {
                        throw new Error();
                    }
                },
                () => console.log("Delete Item Error"))

        }


    }

    modify(item, updatedVal) {
        const url = `${this.cartUrl}/${item.productInfo.productId}`;
        this.http.post<ProductInOrder>(url, updatedVal).subscribe(p => {
            item.quantity = p.productQuantity;
            this.totalSubject.next(this.totalSubject.value + (p.productQuantity - item.quantity) * item.productInfo.productPrice);
        }, () => console.log("Modify Item Error"));

    }

    checkout() {

    }

    addItem(item) {

        if (!this.currentUser) {
            // if un-login
            if (this.cookieService.check('cart')) {
                this.localMap = JSON.parse(this.cookieService.get('cart'));

            }
            if (!this.localMap[item.productInfo.productId]) {
                this.localMap[item.productInfo.productId] = item;
            } else {
                this.localMap[item.productInfo.productId].quantity += item.quantity;
            }
            this.cookieService.set('cart', JSON.stringify(this.localMap));
        } else {
            const url = `${this.cartUrl}/add`;
            this.http.post<Cart>(url, {
                "quantity": item.quantity,
                "productId": item.productInfo.productId
            }).subscribe(() => 0, () => console.log("Add Item Error"))


        }


        // if login
        // this.cartService.addItem(this.itemForm).subscribe(items=> console.log(items));
    }

    storeItems() {
        if (this.localMap)
            this.cookieService.set('cart', JSON.stringify(this.localMap));
    }

    clearLocalCart() {
        this.cookieService.delete('cart');
        this.localMap = {};
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.log(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}

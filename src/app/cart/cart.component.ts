import {Component, OnInit} from '@angular/core';
import {CartService} from '../shared/cart.service';
import {ProductInfo} from '../shared/productInfo';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  items: Item[] = [];
  map: any;
  title: string;
  total: number;

  constructor(private cartService: CartService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.getCart();
    this.title = 'My Cart';
  }

  ngOnDestroy() {
    localStorage.setItem('cart', JSON.stringify(this.map));
  }

  getCart() {
    // this.cartService.getCart().subscribe(items => this.items);
    // console.log('cart: ' + this.items);
    this.map = JSON.parse(localStorage.getItem('cart'));

    if (this.map) {
      this.items = Object.values(this.map);
    }

    this.total = this.items.reduce((accum, cur) => (accum + cur.quantity * cur.productInfo.productPrice), 0);
  }

  minus(item) {
    if (item.quantity == 1) {
      return;
    }
    item.quantity--;
    this.total -= item.productInfo.productPrice;

  }


  plus(item) {
    if (item.quantity == item.productInfo.productStock) {
      return;
    }
    item.quantity++;
    this.total += item.productInfo.productPrice;

  }

  change(item) {
    const max = item.productInfo.productStock;
    if (item.quantity > max) {
      item.quantity = max;
    } else if (item.quantity < 1) {
      item.quantity = 1;
    }
    this.total = this.items.reduce((accum, cur) => (accum + cur.quantity * cur.productInfo.productPrice), 0);

  }

  remove(todo) {
    this.total -= todo.quantity * todo.productInfo.productPrice;
    delete this.map[todo.productInfo.productId];
    this.items = this.items.filter(item => {
      return item.productInfo.productId != todo.productInfo.productId;
    });

  }

  checkout() {

  }
}

export class Item {
  productInfo: ProductInfo;
  quantity: number;
}

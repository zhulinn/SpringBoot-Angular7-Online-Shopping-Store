import {Component, OnInit} from '@angular/core';
import {ProductInfo} from '../shared/productInfo';
import {ProductService} from '../shared/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../shared/cart.service';
import {Item} from '../cart/cart.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  productInfo: ProductInfo;
  title: string;
  item: Item = {
    quantity: 1,
    productInfo: new ProductInfo()
  };

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.getProduct();
    this.title = 'Product Detail';
  }

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getDetail(id)
      .subscribe(prod => {
        this.productInfo = prod;
        this.item.productInfo = this.productInfo;
      });
  }

  addToCart() {
    console.log('submit');
    //if un-login
    let map = JSON.parse(localStorage.getItem('cart'));
    if (!map) {
      map = {};
    }
    if (!map[this.productInfo.productId]) {
      map[this.productInfo.productId] = this.item;
    } else {
      map[this.productInfo.productId].quantity += this.item.quantity;
    }


    localStorage.setItem('cart', JSON.stringify(map));
    console.log(JSON.parse(localStorage.getItem('cart')));


    // if login
    // this.cartService.addItem(this.itemForm).subscribe(items=> console.log(items));


    this.router.navigateByUrl('/cart');
  }
}


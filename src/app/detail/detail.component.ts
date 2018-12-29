import {Component, Input, OnInit} from '@angular/core';
import {ProductInfo} from '../shared/productInfo';
import {ProductService} from '../shared/product.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  productInfo: ProductInfo;
  title: string;
  quantity: number;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getProduct();
    this.title = 'Product Detail';
    this.quantity = 1;
  }

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getDetail(id)
      .subscribe(prod => this.productInfo = prod);
  }
}

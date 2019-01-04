import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {ProductInOrder} from "../shared/models/ProductInOrder";
import {OrderService} from "../shared/services/order.service";
import {Order} from "../shared/models/Order";
import {ActivatedRoute} from "@angular/router";
import {map, switchMap} from "rxjs/operators";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

    constructor(private orderService: OrderService,
                private route: ActivatedRoute) {
    }

    items$: Observable<ProductInOrder[]>;

    ngOnInit() {
        // this.items$ = this.route.paramMap.pipe(
        //     map(paramMap =>paramMap.get('id')),
        //     switchMap((id:string) => this.orderService.show(id))
        // )
        this.items$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
    }

}

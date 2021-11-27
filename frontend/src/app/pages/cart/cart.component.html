<h1 align="center" class="display-4 mb-5">My Cart</h1>

<!--Cart Detail Table-->
<table class="table table-striped text-center">
    <thead>
    <tr>
        <th scope="col">Photo</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Subtotal</th>
        <th scope="col">Action</th>

    </tr>
    </thead>
    <tbody>

    <tr *ngFor="let productInOrder of productInOrders">
        <th class="align-middle" scope="row">
            <a routerLink="/product/{{productInOrder.productId}}"><img height="100px"
                                                                       src="{{productInOrder.productIcon}}"
                                                                       alt="{{productInOrder.productName}}"></a>
        </th>
        <td class="align-middle"><a
                routerLink="/product/{{productInOrder.productId}}">{{productInOrder.productName}}</a></td>
        <td class="align-middle">{{productInOrder.productPrice | currency}}</td>

        <td class="align-middle">
            <a (click)="minusOne(productInOrder)"><i class="fa fa-minus"></i></a>
            <input min="1" id="{{productInOrder.productId}}"
                   [max]=productInOrder.productStock
                   [(ngModel)]="productInOrder.count"
                   (change)="onChange(productInOrder)"
                   size="5"
                   type="number"
                   required
                   name='count'>
            <a (click)="addOne(productInOrder)"> <i class="fa fa-plus"></i></a>
        </td>

        <td class="align-middle">{{productInOrder.productPrice * productInOrder.count|currency}}</td>
        <td class="align-middle">
            <a (click)="remove(productInOrder)" routerLink="./">Remove</a>
        </td>

    </tr>

    </tbody>
</table>

<div *ngIf="productInOrders?.length > 0; else empty">
    <h5 style="display: inline;">Total: {{total | currency}}</h5>
    <button (click)="checkout()" class="btn btn-warning float-right">Checkout</button>
</div>
<ng-template #empty>
    <h4 class="text-muted text-center">Cart is empty. Go to get something! :)</h4>
</ng-template>



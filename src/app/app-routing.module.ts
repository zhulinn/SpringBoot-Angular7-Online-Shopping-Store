import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CardComponent} from './card/card.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {DetailComponent} from './detail/detail.component';
import {CartComponent} from './cart/cart.component';
import {AuthGuard} from "./_guards/auth.guard";
import {OrderComponent} from "./order/order.component";
import {OrderDetailComponent} from "./order-detail/order-detail.component";
import {ProductListComponent} from "./product.list/product.list.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";

const routes: Routes = [
    {path: '', redirectTo: '/product', pathMatch: 'full'},
    {path: 'product/:id', component: DetailComponent},
    {path: 'category/:id', component: CardComponent},
    {path: 'product', component: CardComponent},
    {path: 'category', component: CardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LoginComponent},
    {path: 'register', component: SignupComponent},
    {path: 'cart', component: CartComponent},
    {path: 'success', component: SignupComponent},
    {path: 'order/:id', component: OrderDetailComponent, canActivate: [AuthGuard]},
    {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
    {path: 'seller', redirectTo: 'seller/product', pathMatch: 'full'},
    {
        path: 'seller/product',
        component: ProductListComponent,
        canActivate: [AuthGuard],
        data: {roles: ['ROLE_MANAGER', 'ROLE_EMPLOYEE']}
    },
    {
        path: 'profiles',
        component: UserDetailComponent,
        canActivate: [AuthGuard]
    }

];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)//{onSameUrlNavigation: 'reload'}
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

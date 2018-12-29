import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CardComponent} from './card/card.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {DetailComponent} from './detail/detail.component';
import {CartComponent} from './cart/cart.component';

const routes: Routes = [
  {path: '', redirectTo: '/product', pathMatch: 'full'},
  {path: 'product', component: CardComponent},
  {path: 'category', component: CardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: CardComponent},
  {path: 'register', component: SignupComponent},
  {path: 'product/:id', component: DetailComponent},
  {path: 'category/:id', component: CardComponent},
  {path: 'cart', component: CartComponent},
  {path: 'success', component: SignupComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

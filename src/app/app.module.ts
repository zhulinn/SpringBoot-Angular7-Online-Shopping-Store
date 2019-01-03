import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavigationComponent} from './navigation/navigation.component';
import {FooterComponent} from './footer/footer.component';
import {CardComponent} from './card/card.component';
import {PaginationComponent} from './pagination/pagination.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {DetailComponent} from './detail/detail.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CartComponent} from './cart/cart.component';
import {CookieService} from "ngx-cookie-service";
import {ErrorInterceptor} from "./_interceptors/error-interceptor.service";
import {JwtInterceptor} from "./_interceptors/jwt-interceptor.service";

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        FooterComponent,
        CardComponent,
        PaginationComponent,
        LoginComponent,
        SignupComponent,
        DetailComponent,
        CartComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,

    ],
    providers: [CookieService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},],
    bootstrap: [AppComponent]
})
export class AppModule {
}

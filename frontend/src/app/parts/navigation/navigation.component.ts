import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Observable, Subscription} from 'rxjs';
import {JwtResponse} from '../../response/JwtResponse';
import {Router} from '@angular/router';
import {Role} from '../../enum/Role';
import {ProductService} from 'src/app/services/product.service';
import {Categories} from 'src/app/models';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {


    currentUserSubscription: Subscription;
    name$;
    categories$: Observable<Categories>;
    name: string;
    currentUser: JwtResponse;
    root = '/';
    Role = Role;

    constructor(private userService: UserService,
                private productService: ProductService,
                private router: Router,
    ) {
      this.categories$ = this.getNavigation();
    }


    ngOnInit() {
        this.name$ = this.userService.name$.subscribe(aName => this.name = aName);
        this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (!user || user.role === Role.Customer) {
                this.root = '/';
            } else {
                this.root = '/seller';
            }
        });
    }

    ngOnDestroy(): void {
        this.currentUserSubscription.unsubscribe();
        // this.name$.unsubscribe();
    }

    logout() {
        this.userService.logout();
        // this.router.navigate(['/login'], {queryParams: {logout: 'true'}} );
    }

    getNavigation(): Observable<Categories> {
      return this.productService.getAllCategories();
    }
}

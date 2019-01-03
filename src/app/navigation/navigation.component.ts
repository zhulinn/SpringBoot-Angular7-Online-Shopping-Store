import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../shared/user.service";
import {Observable, Subscription} from "rxjs";
import {JwtResponse} from "../shared/response/JwtResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  currentUserSubscription: Subscription;
  currentUser: JwtResponse;
  constructor(private userService: UserService,
              private router: Router) {
    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login'], {queryParams: {logout: 'true'}} );
  }

}

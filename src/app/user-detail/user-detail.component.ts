import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/models/User";
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {




    constructor(private userService: UserService,
                private router: Router) {
    }

    user= new User();


    ngOnInit() {
        const account = this.userService.currentUserValue.account;

        this.userService.get(account).subscribe( u => {
            this.user = u;
            this.user.password = '';
        }, e => {

        });
    }

    onSubmit() {
        this.userService.update(this.user).subscribe(u => {
            this.userService.nameTerms.next(u.name);
            let url = '/';
            if (this.user.role != 'ROLE_CUSTOMER') {
                url = '/seller';
            }
            this.router.navigateByUrl(url);
        }, _ => {})
    }

}

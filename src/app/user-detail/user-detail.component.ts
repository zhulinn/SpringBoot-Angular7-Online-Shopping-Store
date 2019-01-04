import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/models/User";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

    constructor(private userService: UserService,
                private router: Router) {
    }

    user: User;


    ngOnInit() {
        const account = this.userService.currentUserValue.account;
        this.userService.get(account);
    }

    onSubmit() {
        this.userService.update(this.user).subscribe(u => {
            let url = '/';
            if (this.user.role != 'ROLE_CUSTOMER') {
                url = '/seller';
            }
            this.router.navigateByUrl(url);
        })
    }

}

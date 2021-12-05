import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {


    constructor(private userService: UserService,
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.userService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${currentUser.type} ${currentUser.token}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        return next.handle(request);
    }
}

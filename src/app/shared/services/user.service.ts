import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiUrl} from "../mockData";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {JwtResponse} from "../response/JwtResponse";
import {CookieService} from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private currentUserSubject: BehaviorSubject<JwtResponse>;
    public currentUser: Observable<JwtResponse>;


    constructor(private http: HttpClient,
                private cookieService:CookieService) {
        let memo = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(memo));
        this.currentUser = this.currentUserSubject.asObservable();
        cookieService.set('currentUser', memo);
    }

    get currentUserValue() {
        return this.currentUserSubject.value;
    }


    login(loginForm): Observable<JwtResponse> {
        const url = `${apiUrl}/login`;
        return this.http.post<JwtResponse>(url, loginForm).pipe(
            tap(user => {
                if (user && user.token) {
                    this.cookieService.set('currentUser', JSON.stringify(user));
                    if (loginForm.remembered) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                    this.currentUserSubject.next(user);
                }
            }),
            catchError(this.handleError('Login Failed', null))
        );
    }

    logout() {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        this.cookieService.delete('currentUser');
    }

//%7B%22token%22%3A%22eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBlbWFpbC5jb20iLCJpYXQiOjE1NDY1MzM4MjYsImV4cCI6MTU0NjYyMDIyNn0.ci-DsU0T4KY2jtW6Avz5VgRQiPHftJWdKWakBaYsh5V2sAqrD5kNuT4-PR0P6OY1NgaD_7BSkb-s09hRqYVWHA%22%2C%22type%22%3A%22Bearer%22%2C%22account%22%3A%22manager1%40email.com%22%2C%22name%22%3A%22manager1%22%2C%22authorities%22%3A%5B%7B%22authority%22%3A%22ROLE_MANAGER%22%7D%5D%7D
//%7B%22token%22%3A%22eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjdXN0b21lcjFAZW1haWwuY29tIiwiaWF0IjoxNTQ2NTMzMzI0LCJleHAiOjE1NDY2MTk3MjR9.bL0hO28EbYy6ouF_zmZko05KZ4o0ML7WgrjszeBSZzD1fqOW-jXxqCrCLg6oqb7bzVClyLns8al75d-hjHl2Eg%22%2C%22type%22%3A%22Bearer%22%2C%22account%22%3A%22customer1%40email.com%22%2C%22name%22%3A%22customer1%22%2C%22authorities%22%3A%5B%7B%22authority%22%3A%22ROLE_CUSTOMER%22%7D%5D%7D
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.log(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}

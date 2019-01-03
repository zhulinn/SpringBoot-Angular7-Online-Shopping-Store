import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ProductInfo} from '../models/productInfo';
import {apiUrl} from '../mockData';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = `${apiUrl}/product`;
    private categoryUrl = `${apiUrl}/category`;

    constructor(private http: HttpClient) {
    }

    getAllInPage(page: number, size: number): Observable<any> {
        const url = `${this.productUrl}?page=${page}&size=${size}`;
        return this.http.get(url)
            .pipe(
                // tap(_ => console.log(_)),
            )
    }

    getCategoryInPage(categoryType: number, page: number, size: number): Observable<any> {
        const url = `${this.categoryUrl}/${categoryType}?page=${page}&size=${size}`;
        return this.http.get(url).pipe(
            // tap(data => console.log(data))
        );
    }

    getDetail(id: String): Observable<ProductInfo> {
        const url = `${this.productUrl}/${id}`;
        return this.http.get<ProductInfo>(url).pipe(
            catchError(_ => of(null))
        );

    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}

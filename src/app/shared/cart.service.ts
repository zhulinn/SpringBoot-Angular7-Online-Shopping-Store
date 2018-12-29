import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Item} from '../cart/cart.component';
import {apiUrl} from './mockData';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = `${apiUrl}/cart`;
  constructor(private http: HttpClient) { }


  getCart(): Observable<Item[]> {
    return this.http.get<Item[]>(this.cartUrl);
  }



}

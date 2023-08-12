import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private _http: HttpClient) {}

  addCustomer(customer: any): Observable<any> {
    return this._http.post('/api/customer', customer);
  }

  getCustomers(page: number, size: number): Observable<any> {
    return this._http.get(
      `/api/customer?page=${page ?? 0}&pageSize=${size ?? 20}`
    );
  }

  deleteCustomer(id: number): Observable<any> {
    return this._http.delete(`/api/customer/${id}`);
  }

  updateCustomer(customer: any): Observable<any> {
    if (customer.id == null) {
      return throwError(() => 'Customer ID is required');
    }
    let call = this._http.put('/api/customer', customer);
    call.subscribe(() => {});
    return call;
  }
}

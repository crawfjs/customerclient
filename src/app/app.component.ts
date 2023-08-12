import { MatDialog } from '@angular/material/dialog';
import { CustomerEntryComponent } from './customer-entry/customer-entry.component';
import { CustomerService } from './services/customer.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles/theme.scss'],
})
export class AppComponent {
  title = 'Customer Manager';

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'modifiedDate',
    'createdDate',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private _customerService: CustomerService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;
          return this._customerService.getCustomers(
            this.pageIndex,
            this.pageSize
          );
        }),
        map((data) => {
          this.totalCount = data.totalRecords;
          this.pageSize = data.pageSize;
          this.totalCount = data.totalRecords;
          return data;
        })
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<any>(data.data);
        this.dataSource._updateChangeSubscription();
      });
  }

  openCustomerEntryForm(customer: any) {
    const dialogRef = this.dialog.open(CustomerEntryComponent, {
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadCustomerData(this.pageIndex, this.pageSize);
    });
  }

  reloadCustomerData(pageNumber: number = 0, pageSize: number = 20) {
    this._customerService
      .getCustomers(this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.totalCount = data.totalRecords;
          this.pageIndex = data.pageNumber;
          this.pageSize = data.pageSize;
          this.dataSource = new MatTableDataSource<any>(data.data);
          this.totalCount = data.totalRecords;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  deleteCustomer(id: number) {
    this._customerService.deleteCustomer(id).subscribe(() => {
      this.reloadCustomerData(this.pageIndex, this.pageSize);
      console.log('Deleted - Complete');
    });
  }
}
function observableOf(arg0: never[]): any {
  throw new Error('Function not implemented.');
}

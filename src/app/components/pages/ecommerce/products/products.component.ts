import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
    catchError,
    of as observableOf,
    merge,
    startWith,
    switchMap,
    map,
} from 'rxjs';
import { ApiService } from 'src/app/components/core/services/api.service';
import { CoreService } from 'src/app/components/core/services/core.service';
import { ProductService } from 'src/app/components/core/services/product.service';
import { SortingDataAccessorService } from 'src/app/components/core/services/sorting-data-accessor.service';
import { EditCreateDialogComponent } from 'src/app/components/shared/components/edit-create-dialog/edit-create-dialog.component';
import { TableComponent } from 'src/app/components/shared/components/table/table.component';
import { dialogData } from 'src/app/components/shared/models/Dialog-data.model';
import { Product } from 'src/app/components/shared/models/Product.model';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
    Product!: Product[];
    dataSource=new MatTableDataSource<Product>(this.Product);
    displayedColumns: string[]= [
        'productId',
        'name',
        'category.categoryName',
        'stockQuantity',
        'price',
        'description',
        'lastUpdate',
        'action',
    ];
    isLoadingResults!:boolean;
    isEmpty: boolean = false;
    DataNumber!: number;
    filterValue!: string;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
   
    constructor(
        private matDialog: MatDialog,
        private productService: ProductService,
        private _liveAnnouncer: LiveAnnouncer,
        private _coreService: CoreService,
        private sortingService: SortingDataAccessorService
    ) {}

    ngOnInit() {
        //  this.loadData();
        this.listData();
        this.dataSource.sortingDataAccessor =
            this.sortingService.sortingDataAccessor;
    }

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(
            () => (this.paginator.pageIndex = 0)
        );
        merge(this.paginator.page, this.sort.sortChange)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.productService
                        .findProduct(
                            this.paginator?.pageIndex ?? 0,
                            this.paginator?.pageSize ?? 5,
                            this.sort?.active ?? 'productId',
                            this.sort?.direction ?? 'asc'
                        )
                        .pipe(catchError(() => observableOf(null)));
                }),
                map((data) => {
                    this.isLoadingResults = false;

                    if (data === null) {
                        return [];
                    }

                    // Only refresh the result length if there is new data. In case of rate
                    // limit errors, we do not want to reset the paginator to zero, as that
                    // would prevent users from re-triggering requests.
                    // this.resultsLength = data.total_count;
                    return data;
                })
            )
            .subscribe((data) => {
                this.dataSource = new MatTableDataSource(data.content);
            });

        // this.table.sort.sortChange
        //  .subscribe(()=>{
        //   this.ProDataSource = new MatTableDataSource(this.loadData() as any)
        // });
    }

    onEdit(data: any): void {
        console.log(data);
        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.width = '700px';
        dialogConfig.data = {
            title: 'Edit Product',
            actionButtonText: 'edit',
            Data: data,
            productId: data.productId,
        };

        const dialogRef = this.matDialog.open(
            EditCreateDialogComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((result) => {
            this.loadData();
        });
    }

    onDelete(data: any): void {
        console.log(data);
        this.productService.deleteProductById(data.productId).subscribe({
            next: (data) => {
                console.log(data);
                this.loadData();
                this._coreService.openSuccessSnackBar('data has deleted');
            },
            error:(error) => {
                console.error(error);
                this._coreService.openErrorSnackBar(error.error);
            }
        }
           
        );
    }

    loadData(): void {
        this.productService
            .findProduct(
                this.paginator?.pageIndex ?? 0,
                this.paginator?.pageSize ?? 5,
                this.sort?.active ?? 'productId',
                this.sort?.direction ?? 'asc'
            )
            .subscribe((data) => {
                console.log(data);
                this.dataSource = new MatTableDataSource(data.content);
                // this.ProDataSource.data = data.content ;
            });
    }

    listData() {
        console.log('listData');
        this.productService.getProducts().subscribe((data) => {
            console.log(data);
            this.DataNumber = data.length;
            if (data.length == 0) {
                this.isEmpty = true;
            }
        });
    }

    applyFilter(event: KeyboardEvent) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();

        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const category = JSON.stringify(
                data.category.categoryName
            ).toLowerCase();
            const name = JSON.stringify(data.name).toLowerCase();
            const description = JSON.stringify(data.description).toLowerCase();
            const lastUpdate = JSON.stringify(data.lastUpdate).toLowerCase();
            filter = filter.toLowerCase();
            return (
                category.includes(filter) ||
                name.includes(filter) ||
                description.includes(filter) ||
                lastUpdate.includes(filter)
            );
        };
    }

    openDialogCreate(): void {
        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.width = '700px';

        dialogConfig.data = {
            title: 'Create New Product',
            actionButtonText: 'Create',
        };

        const dialogRef = this.matDialog.open(
            EditCreateDialogComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((result) => {this.loadData();});
    }
}

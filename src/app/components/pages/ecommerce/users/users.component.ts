import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { user } from 'src/app/components/shared/models/user.model';
import { UserService } from 'src/app/components/core/services/user.service';
import { TableComponent } from 'src/app/components/shared/components/table/table.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangeRoleComponent } from 'src/app/components/shared/components/change-role/change-role.component';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { merge, of as observableOf } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SortingDataAccessorService } from 'src/app/components/core/services/sorting-data-accessor.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    active = true;
    blocked = true;
    isLoadingResults=true;
    isEmpty:boolean=false;
    DataNumber!:number;
    user!:user[];
    hasImage: boolean=false;
    hasAction: boolean;
    filterValue: string;
    dropdownItems: string[]=['Edit'];
    sortActive: string="id";
    endpoint: string="user";
    dataSource =new MatTableDataSource<user>(this.user);
    displayedColumns: string[]=['id','firstName','lastName','email','roleName','action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        public themeService: CustomizerSettingsService,
        private userService:UserService,
        private matDialog: MatDialog,
        private sortingService: SortingDataAccessorService
        // private table: TableComponent,
    ) {}

    ngOnInit(): void {
        // this.loadData();
        this.listData();
        this.dataSource.sortingDataAccessor =this.sortingService.sortingDataAccessor;

    }

    ngAfterViewInit(){
      this.sort.sortChange.subscribe(
        () => (this.paginator.pageIndex = 0)
      );
     this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
     merge(this.paginator.page,this.sort.sortChange) 
     .pipe(
      startWith({}),
      switchMap(() => {
          this.isLoadingResults = true;
          return this.userService
          .findUsers(
            this.paginator?.pageIndex ?? 0,
            this.paginator?.pageSize ?? 5,
            this.sort?.active ?? this.sortActive,
            this.sort?.direction ?? "asc")
            .pipe(catchError(() => observableOf(null)));
            
      }),
      map(data => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          return data;
      }),
     )
      .subscribe((data)=>{
        this.dataSource = new MatTableDataSource(data.content) ;
      });

      // this.table.sort.sortChange
      //  .subscribe(()=>{
      //   this.UserDataSource = new MatTableDataSource(this.loadData() as any) 
      // }); 
    }

    onEdit(data: any): void {
      
      console.log(data);
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.width = "500px";
      dialogConfig.data = {
        name: "role",
        title: "role",
        actionButtonText: "edit",
        Data: data
      }
  
      const dialogRef = this.matDialog.open(ChangeRoleComponent,dialogConfig);
      dialogRef.afterClosed().subscribe( result => {this.loadData();} )
    
    }

    loadData():void{
        this.userService
        .findUsers(
          this.paginator?.pageIndex ?? 0,
          this.paginator?.pageSize ?? 5,
          this.sort?.active ?? this.sortActive,
          this.sort?.direction ?? "asc")
          .subscribe((data)=>{
            console.log(data);
           this.dataSource=new MatTableDataSource(data.content);
          // this.ProDataSource.data = data.content ;
          });
      }
    
      listData(){
        console.log("listData");
        this.userService
        .getUsers().subscribe(data=> {
          console.log(data);
          this.DataNumber=data.length;
          if(data.length==0){
            this.isEmpty=false;
          }
        })
      }

    applyFilter(event: KeyboardEvent) {
    
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const role = JSON.stringify(data.roleName).toLowerCase();
          const email = JSON.stringify(data.email).toLowerCase();
          const firstName = JSON.stringify(data.firstName).toLowerCase();
          const lastName = JSON.stringify(data.lastName).toLowerCase();
          const id = JSON.stringify(data.id).toLowerCase();
          filter = filter.toLowerCase(); 
         return (  role.includes(filter) 
                  || email.includes(filter) 
                  || firstName.includes(filter) 
                  || lastName.includes(filter) 
                  || id.includes(filter)
                 ) ;
       };
    }

    getIconPath(roleName: string): string {
      switch (roleName) {
        case 'ROLE_USER':
          return 'assets/img/icon/admin.png';
        case 'ROLE_MODERATOR':
          return 'assets/img/icon/maintainer.png';
        case 'ROLE_ADMIN':
          return 'assets/img/icon/editor.png';
        default:
          return ''; // Provide a default image path or handle the case where role name doesn't match any expected value.
      }
    }
    
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}



import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/components/core/services/api.service';
import { CoreService } from 'src/app/components/core/services/core.service';
import { ProductService } from 'src/app/components/core/services/product.service';
import { Category } from '../../models/Category.model';
import { EditCreateDialogComponent } from '../edit-create-dialog/edit-create-dialog.component';
import { Validators } from '@angular/forms';
import { CategoryService } from 'src/app/components/core/services/category.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  empForm!: FormGroup;

  public categories: Category[] = [];
  message: string = "";
  
  
  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService:CategoryService,
        private _fb: FormBuilder,
        private _coreService: CoreService,
        private _dialogRef: MatDialogRef<EditCreateDialogComponent> ) {}
  
 ngOnInit(): void {
  this.empForm = this._fb.group({
    categoryName: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  this.empForm.get('categoryName')?.statusChanges.subscribe((status) => {
    if (status === 'INVALID') {
      console.log(status);
      this.empForm.get('categoryName')?.markAsTouched();
    }
  });

  if (this.data.Data) {
    this.empForm.setValue({
      categoryName: this.data.Data.categoryName
    });
  }
}
  errorMessage(){
    // if ((this.empForm.get('categoryName')?.hasError('required'))) {
    //   return 'You must enter a value';
    // }
    // if(this.empForm.get('categoryName')?.hasError('required') && this.empForm.get('categoryName')?.value) {
    //   return  'Not a valid fullName' ;
    // } 
    // else{
    //   return '';
    // }
  }

  onSubmit(){
    if(this.empForm.valid){
      if (this.data.Data) {
        console.log(this.data.Data);
        const formData = new FormData();
        formData.append("categoryName",this.empForm.value.categoryName)
        this.apiService 
          .updateCategory(this.data.Data.categoryId, formData)
          .subscribe({ 
            next: (val: any) => {
              this._coreService.openSuccessSnackBar('categoy details updated!');
              this._dialogRef.close(true);
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.error.message);
              this._coreService.openErrorSnackBar(err.error.message);
            },
          });
      } else {
        const formData = new FormData();
        console.log(this.empForm.value)
        formData.append("categoryName",this.empForm.value.categoryName)
      
        this.apiService.postCategories(formData).subscribe(
          {
            next: (val: any) => {
              this._coreService.openSuccessSnackBar('Category successfully added!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err.error.message);
              this._coreService.openErrorSnackBar(err.error.message);
            },
          }
        );
      }
    }else {
      console.log("no valid data")
    }
}
}

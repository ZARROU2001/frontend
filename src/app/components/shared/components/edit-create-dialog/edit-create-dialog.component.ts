import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { CoreService } from 'src/app/components/core/services/core.service';
import { Category } from '../../models/Category.model';
import { ProductService } from 'src/app/components/core/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-create-dialog',
  templateUrl: './edit-create-dialog.component.html',
  styleUrls: ['./edit-create-dialog.component.scss']
})

export class EditCreateDialogComponent {
  empForm!: FormGroup;
  public categories: Category[] = [];

  userFile: any;
  message: string = "";
  imgURL: any ;
  imagePath: any;
  productId: string;
  
  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private productService :ProductService,
        private _fb: FormBuilder,
        private _coreService: CoreService,
        private _dialogRef: MatDialogRef<EditCreateDialogComponent> ) {}
  
  ngOnInit(): void {
    console.log(this.data)
    this.listProductCategories()
    this.empForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', Validators.required),
      category: new FormControl('', [Validators.required, Validators.minLength(4)]),
      imageUrl: new FormControl(''),
      priceBeforeDiscount : new FormControl(''),
      priceAfterDiscount : new FormControl('',Validators.required),
      quantity : new FormControl('',Validators.required)
    });

    if(this.data.Data){
      console.log(this.data.Data.name)
      this.empForm.patchValue({
        name:this.data.Data.name,
        description:this.data.Data.description,
        category:this.data.Data.category.categoryName,
        priceAfterDiscount:this.data.Data.priceAfterDiscount,
        priceBeforeDiscount:this.data.Data.priceBeforeDiscount,
        quantity:this.data.Data.stockQuantity
      })
      this.productId = this.data.Data.productId
      console.log("aaa")
      console.log(this.productId)
      console.log(this.imgURL)
    }
  }


  listProductCategories(){
    this.productService.getProductCategories().subscribe(
      data => {
        console.log(data)
        this.categories = data;
      }
    )
  }

  onSubmit(){
    if(this.empForm.valid){
      if (this.data.Data) {
        console.log(this.data.productId);
        console.log(this.data);
        const formData = new FormData();
        formData.append("description",this.empForm.value.description)
        formData.append("name",this.empForm.value.name)
        formData.append("category",this.empForm.value.category)
        formData.append("category",this.data.categoryName)
        if(this.userFile !=null){
          formData.append("imageUrl", this.userFile);
        }
        formData.append("priceAfterDiscount",this.empForm.value.priceAfterDiscount)
        if(this.empForm.value.priceBeforeDiscount) {
          formData.append("priceBeforeDiscount",this.empForm.value.priceBeforeDiscount)
        }
        formData.append("stockQuantity",this.empForm.value.quantity)   
        this.productService 
          .updateProduct(this.data.productId, formData)
          .subscribe({ 
            next: (val: any) => {
              this._coreService.openSuccessSnackBar('Product details with id: '+this.data.productId+' updated!');
              this._dialogRef.close(true);
            },
            error: (err: HttpErrorResponse) => {
              console.error(err)
              this._coreService.openErrorSnackBar(err.error.message);
            },
          });
      } else {
        const formData = new FormData();
        console.log(this.empForm.value)
        formData.append("description",this.empForm.value.description)
        formData.append("name",this.empForm.value.name)
        formData.append("category",this.empForm.value.category)
        formData.append("imageUrl",this.userFile)
        formData.append("priceAfterDiscount",this.empForm.value.priceAfterDiscount)
        if(this.empForm.value.priceBeforeDiscount) {
          formData.append("priceBeforeDiscount",this.empForm.value.priceBeforeDiscount)
        }
        formData.append("stockQuantity",this.empForm.value.quantity) 
        this.productService.createProduct(formData).subscribe(
          {
            next: (val: any) => {
              this._coreService.openSuccessSnackBar('Product successfully added!');
              this._dialogRef.close(true);
            },
            error: (err: HttpErrorResponse) => {
              console.error(err)
              this._coreService.openErrorSnackBar(err.error.message);
            },
          }
        );
      }
    }else {
      console.log("no valid data")
    }
}

  onSelectFile(event: any) {

    const file = event.target.files[0];
    this.userFile = file;
    this.empForm.patchValue({
    imageUrl: file
    });

   //to change image when you edit product use the following code :
   if(event.target.files) {
    var reader=new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=(event:any) => {
      this.imgURL=event.target.result;
    }
  }
  }
}
import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../core/services/token-storage.sevice';
import { UserService } from '../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreService } from '../../core/services/core.service';
import { AuthService } from '../../core/services/Auth.service';
import { Route, Router } from '@angular/router';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  selectedFile: File | null = null; // variable to hold the selected image file

    form:FormGroup;
    userData:any;
    image?:string;
    userImage: any;
    constructor(
        public themeService: CustomizerSettingsService,
        private _fb:FormBuilder,
        private tokenStorage:TokenStorageService,
        private userService: UserService,
        private _coreService:CoreService,
        private authService:AuthService,
        private router :Router
    ) {}

    ngOnInit(): void {

        this.form = this._fb.group({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          username: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required]),
          // image: new FormControl(''),
            
          });

        const userDataString = this.tokenStorage.getUser();
        if (userDataString) {
          // Parse the string into a JavaScript object
          this.userData = JSON.parse(userDataString).user;
          console.log("true")
          console.log(this.userData)
          this.image=this.userData.imageUrl;

          console.log(this.userData.id)
        } else {
          console.log('No user data found in session storage');
        }

        this.form.setValue({
          firstName:this.userData.firstName,
          lastName:this.userData.lastName,
          username:this.userData.username,
          email:this.userData.email,
        });
    }
    
    onSubmit(){
      const formData = new FormData();
      formData.append("firstName",this.form.value.firstName)
      formData.append("lastName",this.form.value.lastName)
      formData.append("email",this.form.value.email)
      formData.append("username",this.form.value.username)
      if(this.userImage != null){
              formData.append('imageUrl',this.userImage )
      }
      
      this.userService 
        .updatUser(this.userData.id,formData)
        .subscribe({ 
          next: (val: any) => {
            window.alert("you should to signIn again to make these changes");
            this._coreService.openSuccessSnackBar('user details updated successfully! you should SignIn again to save changes');
            this.logout();
          },
          error: (err: HttpErrorResponse) => {
            console.error(err)
            this._coreService.openErrorSnackBar(err.error.message);
          },
        });
    }

    logout(): void {
      this.authService.logout().subscribe({
        next: res => {
          console.log(res);
          this.tokenStorage.signOut();
          this.router.navigate(['authentication/login']);
        },
        error: err => {
          console.log(err);
        }
      });
    }

    onFileSelected(event: any) {
      const file = event.target.files[0];
    this.userImage = file;
    this.form.patchValue({
    imageUrl: file
    });
      if(event.target.files) {
        var reader=new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload=(event:any) => {
          this.image=event.target.result;
        }
      }
    } 

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
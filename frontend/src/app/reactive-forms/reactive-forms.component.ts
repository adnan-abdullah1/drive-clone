import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, FormControl, FormGroup, Validators ,ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent implements OnInit {
  // contactForm = new FormGroup({
  //   firstName : new FormControl('adnan',[Validators.required,Validators.minLength(10)]),
  //   lastName : new FormControl(),
  //   email : new FormControl(),
  //   gender : new FormControl(),
  //   isMarried : new FormControl(),
  //   country : new FormControl(),
  //   address : new FormGroup({
  //     city : new FormControl(),
  //     state : new FormControl()
  //   })
  // })
  contactForm:FormGroup = this.fb.group({
    firstName:['' as string,[Validators.required,Validators.maxLength(4)]],
    lastName:['',[this.customValidator]],
    email:[''],
    gender:[''],
    isMarried:[''],
    country:['',[Validators.required]],
    address:this.fb.group({
      city:[''],
      state:[''],
      street:['']
    })
  })

  constructor(private fb : NonNullableFormBuilder) {
   }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.contactForm.value)
    this.patchValue()
  }
  patchValue(){
    this.contactForm.patchValue({
      firstName:'ads'
    })
    console.log(this.contactForm.value)
  }
  get forms(){
    return this.contactForm.controls
  }
  countryList:country[]=[
    new country("1","pak"),
    new country("2","ind")
  ]
  customValidator(control:AbstractControl):any{
    console.log('called!!!!',control)
    const isValid = true;
    return isValid ? null : { 'myCustomError': 'This value is invalid' };
  }
}
export class country {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

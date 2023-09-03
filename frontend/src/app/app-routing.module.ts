import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsComponent } from './reactive-forms/reactive-forms.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing.module')
        .then(m => m.AuthRoutingModule)
  },
  { path: 'drive', loadChildren: () => import('./drive/drive.module').then(m => m.DriveModule) },
{path:'rx',component:ReactiveFormsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

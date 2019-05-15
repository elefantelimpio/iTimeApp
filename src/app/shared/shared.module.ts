import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [],
  imports: [
    AuthModule,
    CommonModule
  ],
  exports: [],
})
export class SharedModule { }

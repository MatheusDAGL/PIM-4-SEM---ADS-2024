import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { AppComponent } from '../app.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
})
export class AppModule { }

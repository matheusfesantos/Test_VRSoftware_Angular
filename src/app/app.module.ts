import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router'; // Importe o RouterModule

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]) // Adicione isso, mesmo que esteja vazio para configurar o roteamento
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
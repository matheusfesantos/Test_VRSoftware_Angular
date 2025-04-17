import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutosListaComponent } from './pages/produtos-lista/produtos-lista.component';

const routes: Routes = [
  { path: '', component: ProdutosListaComponent },
  // Adicione mais rotas conforme o necessário
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
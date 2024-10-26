import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.page.html',
  styleUrls: ['./registers.page.scss'],
})
export class RegistersPage  {

  username: string = '';
  email: string = '';
  password: string = '';

  constructor() { }

  registerUser() {
    if (this.username && this.email && this.password) {
      console.log('Usuário registrado com sucesso!');
      console.log('Nome:', this.username);
      console.log('E-mail:', this.email);
      console.log('Senha:', this.password);

    } else {
      console.log('Por favor, preencha todos os campos.');
    }
  }
}

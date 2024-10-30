import { BaseService } from './../services/base.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private BaseService: BaseService,
    private http: HttpClient,
    private navController: NavController


  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.emailErrorMessage = null;
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.passwordErrorMessage = null;
    });
  }

  navigateToRegister() {
    this.navController.navigateForward('/registers');

  }

  async onLogin() {
    this.emailErrorMessage = null;
    this.passwordErrorMessage = null;

    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.invalid) {
        if (this.loginForm.get('email')?.hasError('required')) this.emailErrorMessage = 'O campo email é obrigatório.';
        else if (this.loginForm.get('email')?.hasError('email')) this.emailErrorMessage = 'O formato do email é inválido.';
      }

      if (this.loginForm.get('password')?.invalid) this.passwordErrorMessage = 'O campo senha é obrigatório.';

      await this.presentAlert('Formulário inválido', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    return this.http.get<any>(`http://localhost:8000/login.php?email=${email}&password=${password}`, { observe: 'response' }).subscribe({
      next: async (response) => {
        if (response.body.status === 200) {
          await this.presentAlert('Login realizado com sucesso!', 'Bem-vindo(a).');
          this.navController.navigateForward('/products');
        } else if (response.body.status == 401) {
          await this.presentAlert('Erro de login', `${response.body.error}`);
        }
      },
      error: async () => {
        await this.presentAlert('Erro de login', 'Não foi possível realizar o login. Tente novamente.');
      }
    })
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

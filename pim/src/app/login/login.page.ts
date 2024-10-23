import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private alertController: AlertController) {
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

    await this.presentAlert('Login realizado com sucesso!', `Bem Vindo.`);
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

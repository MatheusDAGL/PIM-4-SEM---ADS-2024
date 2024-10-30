import { BaseService } from './../services/base.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './registers.page.html',
  styleUrls: ['./registers.page.scss'],
})
export class RegistersPage implements OnInit {
  registerForm: FormGroup;
  usernameErrorMessage: string | null = null;
  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private BaseService: BaseService,
    private http: HttpClient,
    private navController: NavController
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.usernameErrorMessage = null;
    });
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.emailErrorMessage = null;
    });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.passwordErrorMessage = null;
    });
  }

  async registerUser() {
    this.usernameErrorMessage = null;
    this.emailErrorMessage = null;
    this.passwordErrorMessage = null;

    if (this.registerForm.invalid) {
      if (this.registerForm.get('username')?.invalid) {
        this.usernameErrorMessage = 'O campo nome de usuário é obrigatório.';
      }
      if (this.registerForm.get('email')?.invalid) {
        if (this.registerForm.get('email')?.hasError('required')) {
          this.emailErrorMessage = 'O campo e-mail é obrigatório.';
        } else if (this.registerForm.get('email')?.hasError('email')) {
          this.emailErrorMessage = 'O formato do e-mail é inválido.';
        }
      }
      if (this.registerForm.get('password')?.invalid) {
        this.passwordErrorMessage = 'O campo senha é obrigatório.';
      }

      await this.presentAlert('Formulário inválido', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { username, email, password } = this.registerForm.value;
    const body = { username, email, password };

    return this.http.post<any>('http://localhost:8000/register.php', body, { observe: 'response' }).subscribe({
      next: async (response) => {
        if (response.status === 200) {
          await this.presentAlert('Registro realizado com sucesso!', 'Bem-vindo(a).');
          this.navController.navigateForward('/login');
        }
      },
      error: async () => {
        await this.presentAlert('Erro de registro', 'Não foi possível realizar o registro. Tente novamente.');
      }
    });
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

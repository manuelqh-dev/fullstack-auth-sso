import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario reactivo con las validaciones de campos requeridos y formato de email.
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
   * Getter para facilitar el acceso a los controles en la plantilla HTML.
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Maneja el envío del formulario de autenticación.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials: LoginRequest = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Autenticación exitosa. Token recibido:', response.token);
        // Redirección posterior o acción deseada tras autenticarse
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Comprueba tu correo o contraseña.';
        } else {
          this.errorMessage = 'Error al conectar con el servidor. Inténtalo de nuevo.';
        }
      }
    });
  }
}

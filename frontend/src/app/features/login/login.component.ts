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

  successMessage: string | null = null;
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  // Propiedad para el selector de idioma
  selectedLanguage = 'ES';
  languages = [
    { code: 'ES', label: 'ES' },
    { code: 'EN', label: 'EN' },
    { code: 'FR', label: 'FR' },
    { code: 'PT', label: 'PT' }
  ];

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
      this.errorMessage = 'Introduce un correo electrónico válido (ejemplo@dominio.com).';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null; // Limpiamos mensajes anteriores

    const credentials: LoginRequest = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '¡Inicio de sesión correcto!'; // Banner verde
        console.log('Autenticación exitosa. Token recibido:', response.token);
      },
      error: (error) => {
        this.isLoading = false;
        this.successMessage = null;
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Comprueba tu correo o contraseña.'; // Banner rojo
        } else {
          this.errorMessage = 'Error al conectar con el servidor. Inténtalo de nuevo.';
        }
      }
    });
  }

  /**
   * Inicia el proceso de autenticación mediante el proveedor SSO (Decathlon).
   * Obtiene la URL de redirección del backend y redirige al navegador.
   */
  onSsoLogin(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.initiateSso().subscribe({
      next: (response) => {
        // Redirección del navegador a la URL que simula el proveedor SSO
        window.location.href = response.redirectUrl;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo iniciar la autenticación SSO. Inténtalo de nuevo.';
      }
    });
  }
}

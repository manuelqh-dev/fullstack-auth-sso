import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sso-callback',
  template: `<p>Procesando inicio de sesión con Decathlon...</p>`
})
export class SsoCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Captura el 'code' de la URL y solicita el token JWT al backend.
   */
  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.authService.handleSsoCallback(code).subscribe({
        next: (response) => {
          // Guardamos el token y volvemos al login/pantalla principal
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/login']);
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}

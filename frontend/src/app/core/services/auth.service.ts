import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base apuntando al controlador Spring Boot expuesto en el puerto 8080
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private http: HttpClient) { }

  /**
   * Envía las credenciales al backend para obtener el token JWT.
   * Al recibir respuesta 200 OK, almacena el token en el sessionStorage.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.saveUser(response.username);
        }
      })
    );
  }

  /**
   * Guarda el token JWT en la sesión activa del navegador.
   */
  public saveToken(token: string): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token JWT guardado.
   */
  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda el nombre de usuario autenticado.
   */
  public saveUser(username: string): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.setItem(this.USER_KEY, username);
  }

  /**
   * Comprueba si el usuario tiene un token almacenado.
   */
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión eliminando las claves guardadas.
   */
  public logout(): void {
    sessionStorage.clear();
  }

  /**
   * Solicita al backend el inicio del flujo de autenticación SSO.
   *
   * @returns Observable con la URL de redirección devuelta por el proveedor simulado.
   */
  initiateSso(): Observable<{ redirectUrl: string }> {
    return this.http.get<{ redirectUrl: string }>(`${this.apiUrl}/sso`);
  }

  /**
   * Envía el código de autorización simulado al backend para su validación y la posterior generación del JWT.
   *
   * @param code Código de autorización recibido en los parámetros de la URL.
   * @returns Observable con la respuesta de autenticación (Token JWT).
   */
  handleSsoCallback(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sso/callback`, { code });
  }

}

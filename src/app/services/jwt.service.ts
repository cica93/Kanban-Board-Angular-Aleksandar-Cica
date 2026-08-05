export interface Token {
  exp: number;
}

export class JwtUtils {
  static getToken(): string | null {
    return window.localStorage.getItem('jwtToken');
  }

  static saveToken(token: string): void {
    window.localStorage.setItem('jwtToken', token);
  }

  static destroyToken(): void {
    window.localStorage.removeItem('jwtToken');
  }

  static isTokenValid(): boolean {
    const token: string | null = this.getToken();
    if (!token) {
      return false;
    }
    const { exp } = this.decodeJwt(token);
    return exp * 1000 < Date.now();
  }

  static decodeJwt(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}

import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';

export interface Token {
  exp: number;
}

@Injectable({ providedIn: "root" })
export class JwtService {
  helper = new JwtHelperService();
  getToken(): string | null {
    return window.localStorage.getItem("jwtToken");
  }

  saveToken(token: string): void {
    window.localStorage.setItem("jwtToken", token);
  }

  destroyToken(): void {
    window.localStorage.removeItem("jwtToken");
  }

  isTokenValid(): boolean {
    const token: string | null  = this.getToken();
    if(token){
        const decodedToken: Token | null = this.helper.decodeToken(token);
        if(!decodedToken || decodedToken.exp * 1000 < new Date().getTime()){
          return false;
        }
        return true;
    }
    return false;
  }
}



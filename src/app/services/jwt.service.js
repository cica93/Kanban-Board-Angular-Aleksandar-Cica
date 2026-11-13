export class JwtUtils {
    static getToken() {
        return window.localStorage.getItem('jwtToken');
    }
    static saveToken(token) {
        window.localStorage.setItem('jwtToken', token);
    }
    static destroyToken() {
        window.localStorage.removeItem('jwtToken');
    }
    static isTokenValid() {
        const token = this.getToken();
        if (!token || token === 'undefined') {
            return false;
        }
        const { exp } = this.decodeJwt(token);
        return exp * 1000 > Date.now();
    }
    static decodeJwt(token) {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload ?? ''));
    }
}
//# sourceMappingURL=jwt.service.js.map
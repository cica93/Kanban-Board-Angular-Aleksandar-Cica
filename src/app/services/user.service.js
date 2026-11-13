import { __decorate } from "tslib";
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';
export const userSchema = z.object({
    id: z.number().int().positive(),
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
let UserService = class UserService {
    http = inject(HttpClient);
    currentUser() {
        return this.http.get('users/current');
    }
    getUsers(keyword = '', limit = 10, offset = 0, columnSort = 'id', direction = 'asc') {
        return this.http
            .get('users', {
            params: { keyword, limit, offset, columnSort, direction },
        })
            .pipe(map(({ totalCount, content }) => ({
            content: content.map((user) => {
                const { tasks, token, image, ...rest } = user;
                return rest;
            }),
            totalCount,
        })));
    }
    hasMail(email) {
        return this.http.get(`users/has-email/${email}`, {
            headers: {
                'skip-interceptor': 'true',
            },
        });
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map
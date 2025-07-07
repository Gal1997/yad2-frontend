// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

// const BASE_URL = environment.production
//     ? '/api/'
//     : '//localhost:3030/api/';
const BASE_URL = '//localhost:3000/api/'
const BASE_USER_URL = BASE_URL + 'user/';
const BASE_AUTH_URL = BASE_URL + 'auth/';

export interface User {
    _id: string;
    email: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) { }
    private _loggedInUser$ = new BehaviorSubject<User | null>(this._loadUser());
    public loggedInUser$ = this._loggedInUser$.asObservable();

    private _loadUser(): User | null {
        const userJson = sessionStorage.getItem('loggedinUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(BASE_USER_URL).pipe(
            catchError(this._handleError('getUsers'))
        );
    }

    getById(userId: string): Observable<User> {
        return this.http.get<User>(BASE_USER_URL + userId).pipe(
            catchError(this._handleError(`getById id=${userId}`))
        );
    }

    remove(userId: string): Observable<any> {
        return this.http.delete(BASE_USER_URL + userId).pipe(
            catchError(this._handleError(`remove id=${userId}`))
        );
    }

    update(userToUpdate: User): Observable<User> {
        return this.http.put<User>(BASE_USER_URL, userToUpdate).pipe(
            map((user) => {
                if (this.getLoggedinUser()?._id === user._id) this.saveLocalUser(user);
                return user;
            }),
            catchError(this._handleError('update'))
        );
    }

    login(credentials: any): Observable<User> {
        return this.http.post<User>(BASE_AUTH_URL + 'login', credentials, { withCredentials: true }).pipe(
            map((user) => {
                return this.saveLocalUser(user)
            }
            ),
            catchError(this._handleError('login'))
        );
    }

    signup(credentials: any): Observable<User> {
        return this.http.post<User>(BASE_AUTH_URL + 'signup', credentials, { withCredentials: true })
            .pipe(
                map((user) => {
                    console.log('Signup returned user:', user);
                    return this.saveLocalUser(user);
                }),
                catchError(this._handleError('signup'))
            );
    }

    logout(): Observable<void> {
        return this.http.post<void>(BASE_AUTH_URL + 'logout', {}, { withCredentials: true }).pipe(
            map(() => {
                sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
                this._loggedInUser$.next(null);
            }),
            catchError(this._handleError('logout'))
        );
    }

    // getEmptyUser(): Partial<User> {
    //     return {
    //         username: '',
    //         fullname: '',
    //         password: '',
    //         imgUrl: '',
    //     };
    // }

    saveLocalUser(user: User): User {

        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
        this._loggedInUser$.next(user);
        return user;
    }

    getLoggedinUser(): User | null {
        const userJson = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    private _handleError(context: string) {
        return (err: any) => {
            console.error(`UserService error during ${context}:`, err);
            return throwError(() => err);
        };
    }
}

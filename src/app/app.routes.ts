import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupComponent } from './pages/signup-page/signup-page.component';

export const routes: Routes = [
    { path: 'home', component: LandingPageComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupComponent }
    //{ path: '**', component: PageNotFoundComponent}
];

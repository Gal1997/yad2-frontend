import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupComponent } from './pages/signup-page/signup-page.component';
import { DetailsComponent } from './cmps/details/details.component';
import { PublishPageComponent } from './pages/publish-page/publish-page.component';
import { IndexPageComponent } from './cmps/publish-cmps/index-page/index-page.component';
import { NadlanFormComponent } from './cmps/publish-cmps/nadlan-form/nadlan-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: LandingPageComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'details/:id', component: DetailsComponent },
    {
        path: 'publish',
        component: PublishPageComponent,
        canActivate: [authGuard],
        children: [
            // default child when you hit /publish
            { path: '', component: IndexPageComponent },
            { path: 'nadlan', component: NadlanFormComponent }
            // another page under /publish
            // { path: 'review',     component: PublishReviewComponent },
            // you can add more steps here…
        ]
    },
    //{ path: '**', component: PageNotFoundComponent}
];

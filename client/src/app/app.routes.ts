import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./shared/components/pages/home-page/home-page.component";
import {GalleryPageComponent} from "./shared/components/pages/gallery-page/gallery-page.component";
import {RepertoirePageComponent} from "./shared/components/pages/repertoire-page/repertoire-page.component";
import {EventsPageComponent} from "./shared/components/pages/events-page/events-page.component";
import {VillaPageComponent} from "./shared/components/pages/villa-page/villa-page.component";
import {NgModule} from "@angular/core";
import {LoginPageComponent} from "./shared/components/pages/login-page/login-page.component";

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: 'home', pathMatch: "full"},
    { path: 'gallery', component: GalleryPageComponent},
    { path: 'repertoire', component: RepertoirePageComponent, data: { store: true }},
    { path: 'events', component: EventsPageComponent, data: { store: true }},
    { path: 'villa', component: VillaPageComponent },
    { path: 'login', component: LoginPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

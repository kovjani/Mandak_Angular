import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-cookie-warning',
  standalone: true,
  imports: [],
  templateUrl: './cookie-warning.component.html',
  styleUrl: './cookie-warning.component.scss'
})
export class CookieWarningComponent {
    @HostBinding('attr.id') id = 'cookie-warning-component';

    AcceptCookies(){
        localStorage.setItem("cookies_accepted", 'true');
        location.reload();
    }
}

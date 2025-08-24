import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FooterComponent} from "../../footer/footer.component";
import {Subscription} from "rxjs";
import {AudioPlayerService} from "../../../services/audio-player.service";

@Component({
  selector: 'app-login-page',
    imports: [
        FooterComponent
    ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, OnDestroy{

    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    constructor(
        private audioService: AudioPlayerService,
        private host: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this.audioPlayerShowingSubscription = this.audioService.audioPlayerShowing$.subscribe(() => {
            this.host.nativeElement.classList.add("with-audio-player");
        });
        this.audioPlayerHidingSubscription = this.audioService.audioPlayerHiding$.subscribe(() => {
            this.host.nativeElement.classList.remove("with-audio-player");
        });
    }

    ngOnDestroy() {
        this.audioPlayerShowingSubscription.unsubscribe();
        this.audioPlayerHidingSubscription.unsubscribe();
    }
}

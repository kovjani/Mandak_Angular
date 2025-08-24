import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FooterComponent} from "../../footer/footer.component";
import {Router} from "@angular/router";
import {AudioPlayerService} from "../../../services/audio-player.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-villa-page',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './villa-page.component.html',
  styleUrl: './villa-page.component.scss'
})
export class VillaPageComponent implements OnInit, OnDestroy{

    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    images = [
        "/assets/images/villa/1.jpg",
        "/assets/images/villa/2.jpg",
        "/assets/images/villa/3.jpg",
        "/assets/images/villa/4.jpg",
        "/assets/images/villa/5.jpg",
        "/assets/images/villa/6.jpg",
        "/assets/images/villa/7.jpg",
        "/assets/images/villa/8.jpg",
        "/assets/images/villa/9.jpg",
        "/assets/images/villa/10.jpg",
        "/assets/images/villa/11.jpg",
        "/assets/images/villa/12.jpg",
        "/assets/images/villa/13.jpg",
        "/assets/images/villa/14.jpg",
        "/assets/images/villa/15.jpg",
        "/assets/images/villa/16.jpg",
        "/assets/images/villa/17.jpg",
        "/assets/images/villa/18.jpg",
    ];


    constructor(private router: Router,
                private audioService: AudioPlayerService,
                private host: ElementRef<HTMLElement>,) {}

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

    ViewInGallery(index: number){
        this.router.navigate(['/gallery'], {queryParams: {images: JSON.stringify(this.images), index: index}});
    }
}

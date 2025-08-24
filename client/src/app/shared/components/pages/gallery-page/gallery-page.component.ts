import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import $ from 'jquery';
import {FooterComponent} from "../../footer/footer.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AudioPlayerService} from "../../../services/audio-player.service";

@Component({
  selector: 'app-gallery-page',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss'
})
export class GalleryPageComponent implements OnInit, OnDestroy{

    image_index = 0;
    images = [
        "/assets/images/gallery/1.jpg",
        "/assets/images/gallery/2.jpg",
        "/assets/images/gallery/4.jpg",
        "/assets/images/gallery/5.jpg"
    ];

    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private host: ElementRef<HTMLElement>,
                private audioService: AudioPlayerService) {}

    ngOnInit() {

        this.audioPlayerShowingSubscription = this.audioService.audioPlayerShowing$.subscribe(() => {
            this.host.nativeElement.classList.add("with-audio-player");
        });
        this.audioPlayerHidingSubscription = this.audioService.audioPlayerHiding$.subscribe(() => {
            this.host.nativeElement.classList.remove("with-audio-player");
        });

        let images_str = this.route.snapshot.queryParamMap.get("images");
        let index_str = this.route.snapshot.queryParamMap.get("index");

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
        });

        if(images_str !== null && index_str !== null){
            sessionStorage.setItem('images_str', images_str);
            sessionStorage.setItem('index_str', index_str);
            this.images = images_str ? JSON.parse(images_str) : [];
            this.image_index = Number(index_str);
        } else {
            images_str = sessionStorage.getItem('images_str');
            index_str = sessionStorage.getItem('index_str');
            if(images_str !== null && index_str !== null){
                this.images = images_str ? JSON.parse(images_str) : [];
                this.image_index = Number(index_str);
            }
        }

        this.SetPicture();
    }

    ngOnDestroy() {
        this.audioPlayerShowingSubscription.unsubscribe();
        this.audioPlayerHidingSubscription.unsubscribe();
    }

    private SetPicture(){
        let picture = $("#gallery_picture");
        picture.attr("src", this.images[this.image_index]);
        picture.attr("alt", this.images[this.image_index]);
        sessionStorage.setItem('index_str', this.image_index.toString());
    }

    PreviousPicture(){
        if(this.image_index > 0){
            this.image_index--;
            this.SetPicture();
        }
    }

    NextPicture(){
        if(this.image_index < this.images.length - 1){
            this.image_index++;
            this.SetPicture();
        }
    }
}

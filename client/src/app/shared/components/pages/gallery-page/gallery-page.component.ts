import {Component, OnInit} from '@angular/core';
import {SearchbarService} from "../../../services/searchbar.service";
import {AudioPlayerService} from "../../../services/audio-player.service";
import $ from 'jquery';
import {FooterComponent} from "../../footer/footer.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-gallery-page',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss'
})
export class GalleryPageComponent implements OnInit{

    image_index = 0;
    images = [
        "/assets/images/gallery/1.jpg",
        "/assets/images/gallery/2.jpg",
        "/assets/images/gallery/4.jpg",
        "/assets/images/gallery/5.jpg"
    ];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private searchbarService: SearchbarService,
                private audioService: AudioPlayerService) {}

    ngOnInit() {

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

        this.searchbarService.HideSearchbar();
        this.audioService.HideAudioPlayer();

        this.SetPicture();

        $("#gallery_back_btn").off().on('click', () => {
            if(this.image_index > 0){
                this.image_index--;
                this.SetPicture();
            }
        });

        $("#gallery_next_btn").off().on('click', () => {
            if(this.image_index < this.images.length - 1){
                this.image_index++;
                this.SetPicture();
            }
        });
    }

    private SetPicture(){
        let picture = $("#gallery_picture");
        picture.attr("src", this.images[this.image_index]);
        picture.attr("alt", this.images[this.image_index]);
        sessionStorage.setItem('index_str', this.image_index.toString());
    }
}

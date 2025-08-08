import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import $ from "jquery";

@Component({
  selector: 'app-header-image',
  standalone: true,
  imports: [],
  templateUrl: './header-image.component.html',
  styleUrl: './header-image.component.scss'
})
export class HeaderImageComponent implements OnInit, OnDestroy {
    @Output() update_images = new EventEmitter<string[]>();
    @Output() update_image_index = new EventEmitter<number>();
    @Output() PageChanging = new EventEmitter<string>();

    private interval: any;
    home_pictures_i = 1;
    images: string[] = [
        "/assets/images/gallery/1.jpg",
        "/assets/images/gallery/2.jpg",
        "/assets/images/gallery/4.jpg",
        "/assets/images/gallery/5.jpg"
    ];

    ngOnInit() {
        $("#header-image-container").css({"background-image": `url("${this.images[0]}")`})
        setTimeout(() => {
            $(`#0header-image`).css({"z-index": 1});
            $(`#0header-image`).css({
                left: '0px'
            });
        }, 100);
        this.interval = setInterval(() => this.HomeNext(), 5000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    HomeNext(){
        $(`.header-image`).css({"z-index": 0});
        $(`#${this.home_pictures_i}header-image`).css({"z-index": 1});
        $(`#${this.home_pictures_i}header-image`).animate({
            left: '0px'
        }, 1000, () => {
            if(this.home_pictures_i === 0)
                $(`#${this.images.length - 1}header-image`).css("left", "100vw");
            else
                $(`#${this.home_pictures_i-1}header-image`).css("left", "100vw");
            this.home_pictures_i++;
            if(this.home_pictures_i === this.images.length) this.home_pictures_i = 0;
        });
    }

    ViewInGallery(index: number){
        console.log("Hello");
        this.update_images.emit(this.images);
        this.update_image_index.emit(index);
        this.PageChanging.emit("gallery");
    }
}

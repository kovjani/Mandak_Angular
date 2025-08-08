import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchbarService} from "../../../services/searchbar.service";
import {AudioPlayerService} from "../../../services/audio-player.service";
import $ from 'jquery';
import {FooterComponent} from "../../footer/footer.component";

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
    @Input() images!: string[];
    @Input() image_index!: number; // Index of actual image in images.
    @Output() update_image_index = new EventEmitter<number>();

    constructor(private searchbarService: SearchbarService, private audioService: AudioPlayerService) {}

    ngOnInit() {
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
        this.update_image_index.emit(this.image_index);
    }
}

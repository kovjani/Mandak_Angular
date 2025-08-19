import {MusicDTO} from "./MusicDTO";

export class EventDTO {
    private _event_id: number;
    private _event_date: Date;
    private _event_place: string;
    private _event_conductor: string;
    private _event_title: string;
    private _event_description: string;
    private _event_folder: string;
    private _event_cover_image: string;

    private _event_images: string[] = [];
    private _event_music_list: MusicDTO[] = [];

    constructor(
        event_id: number,
        event_date: Date,
        event_place: string,
        event_conductor: string,
        event_title: string,
        event_description: string,
        event_folder: string,
        event_cover_image: string,
        event_images?: string[],
        event_music_list?: MusicDTO[]) {

        this._event_id = event_id;
        this._event_date = new Date(event_date);
        this._event_place = event_place;
        this._event_conductor = event_conductor;
        this._event_title = event_title;
        this._event_description = event_description;
        this._event_folder = event_folder;
        this._event_cover_image = event_cover_image;

        if(event_images){
            this._event_images = event_images;
        }
        if(event_music_list){
            this._event_music_list = event_music_list;
        }

    }

    get event_id(): number {
        return this._event_id;
    }

    set event_id(value: number) {
        this._event_id = value;
    }

    get event_date(): Date {
        return this._event_date;
    }

    set event_date(value: Date) {
        this._event_date = value;
    }

    get event_place(): string {
        return this._event_place;
    }

    set event_place(value: string) {
        this._event_place = value;
    }

    get event_conductor(): string {
        return this._event_conductor;
    }

    set event_conductor(value: string) {
        this._event_conductor = value;
    }

    get event_title(): string {
        return this._event_title;
    }

    set event_title(value: string) {
        this._event_title = value;
    }

    get event_description(): string {
        return this._event_description;
    }

    set event_description(value: string) {
        this._event_description = value;
    }

    get event_folder(): string {
        return this._event_folder;
    }

    set event_folder(value: string) {
        this._event_folder = value;
    }

    get event_cover_image(): string {
        return this._event_cover_image;
    }

    set event_cover_image(value: string) {
        this._event_cover_image = value;
    }


    get event_images(): string[] {
        return this._event_images;
    }

    set event_images(value: string[]) {
        this._event_images = value;
    }

    get event_music_list(): MusicDTO[] {
        return this._event_music_list;
    }

    set event_music_list(value: MusicDTO[]) {
        this._event_music_list = value;
    }

    get event_date_str(): string {
        return this._event_date.toISOString().split('T')[0];
    }
}

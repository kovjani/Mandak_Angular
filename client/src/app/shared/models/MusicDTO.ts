import { EventDTO } from "./EventDTO";

export class MusicDTO {

    private _music_id: number;
    private _music_title: string;
    private _music_author: string = "";
    private _music_audio: string; // The audio file.
    private _music_event: EventDTO;

    //public constructor(music_id: number, music_title: string);
    public constructor(music_id: number, music_title: string, music_event: EventDTO, music_author?: string) {
        this._music_id = music_id;
        this._music_title = music_title;
        this._music_event = music_event;

        if(music_author){
            this._music_author = music_author;
            this._music_audio = `/assets/events/${music_event.event_folder}/audio/${music_author}_${music_title}.mp3`;
        } else {
            this._music_audio = `/assets/events/${music_event.event_folder}/audio/${music_title}.mp3`;
        }

    }


    get music_id(): number {
        return this._music_id;
    }

    set music_id(value: number) {
        this._music_id = value;
    }

    get music_title(): string {
        return this._music_title;
    }

    set music_title(value: string) {
        this._music_title = value;
    }

    get music_author(): string {
        return this._music_author;
    }

    set music_author(value: string) {
        this._music_author = value;
    }

    get music_audio(): string {
        return this._music_audio;
    }

    set music_audio(value: string) {
        this._music_audio = value;
    }

    get music_event(): EventDTO {
        return this._music_event;
    }

    set music_event(value: EventDTO) {
        this._music_event = value;
    }
}

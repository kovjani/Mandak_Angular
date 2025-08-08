import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {
    private repertoireSearchingSource = new Subject<string>();
    RepertoireSearching$ = this.repertoireSearchingSource.asObservable();

    RepertoireSearch(search_item: string){
        this.repertoireSearchingSource.next(search_item);
    }

    private eventsSearchingSource = new Subject<string>();
    EventsSearching$ = this.eventsSearchingSource.asObservable();

    EventsSearch(search_item: string){
        this.eventsSearchingSource.next(search_item);
    }

    private SearchbarToggleSource = new Subject<Event>();
    SearchbarToggle$ = this.SearchbarToggleSource.asObservable();

    Toggle(event: Event){
        this.SearchbarToggleSource.next(event);
    }

    private SearchbarShowingSource = new Subject<void>();
    SearchbarShowing$ = this.SearchbarShowingSource.asObservable();

    ShowSearchbar(){
        this.SearchbarShowingSource.next();
    }

    private SearchbarHidingSource = new Subject<void>();
    SearchbarHiding$ = this.SearchbarHidingSource.asObservable();

    HideSearchbar(){
        this.SearchbarHidingSource.next();
    }
}

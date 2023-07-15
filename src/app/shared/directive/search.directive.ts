import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appInputSearch]'
})
export class SearchDirective implements OnInit, OnDestroy {

  // search term value emitter
  @Output() searchTerm = new EventEmitter<string>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private _el: ElementRef
  ) { }

  ngOnInit(): void {

    // subscribe to input keyup event
    fromEvent(this._el.nativeElement, 'keyup').pipe(
      takeUntil(this._unsubscribe$),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (val: any) => { 
        const value = val.target.value.trim();
        this.searchTerm.emit(value)
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

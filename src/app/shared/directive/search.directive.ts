/*
 * Date: 11/24/2021
 * Modified: 11/24/2021
 * File: search.directive.ts
 * Project: pwt
 * Copyright EY (c) 2021
 */

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

  /**
   * Initialize the directive/component after Angular first displays the data-bound properties and sets the
   * directive/component's input properties. Called once, after the first ngOnChanges().
   */
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

  /**
   * Cleanup just before Angular destroys the directive/component.
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   * Called just before Angular destroys the directive/component.
   */
  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

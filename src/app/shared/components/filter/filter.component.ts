import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
  @Output() status: EventEmitter<string> = new EventEmitter<string>();  
  
  /**
   * Emit value on change
   * @param value 
  */
 onChange(value: Event): void {
    this.status.emit((value.target as HTMLInputElement).value);
  }
}

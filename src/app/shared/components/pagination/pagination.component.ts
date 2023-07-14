import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 3;
  @Input() itemsPerPage: number = 5;
  @Input() showAmountOptions: number[] = [10, 5, 25, 50, 100];

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() showAmountChanged: EventEmitter<number> = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  onShowAmountChange(value: string): void {
    const showAmount = parseInt(value, 10);
    this.showAmountChanged.emit(showAmount);
  }

  getPages(): number[] {
    const visiblePages = Math.min(this.totalPages, this.itemsPerPage);
    const middlePage = Math.floor(visiblePages / 2);
    let startPage = Math.max(1, this.currentPage - middlePage);
    const endPage = Math.min(startPage + visiblePages - 1, this.totalPages);
    
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
}

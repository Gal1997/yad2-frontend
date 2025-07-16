import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appThousandSeparator]'
})
export class ThousandSeparatorDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // remove any non‐digit (including commas)
    const numeric = value.replace(/\D+/g, '');
    if (!numeric) {
      this.el.value = '';
      return;
    }
    // insert commas every three digits
    const withCommas = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.el.value = withCommas;
  }
}

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mask]',
})
export class MaskDirective {
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  inputElement: HTMLInputElement;
  regex: RegExp;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
    this.regex = new RegExp(this.inputElement.pattern);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.code === 'KeyA' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.code === 'KeyC' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.code === 'KeyV' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.code === 'KeyX' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.code === 'KeyA' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.code === 'KeyC' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.code === 'KeyV' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.code === 'KeyX' && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }

    const newValue = this.forecastValue(e.key);
    if (!this.regex.test(newValue)) {
      e.preventDefault();
    }
  }

  private forecastValue(key: string): string {
    const selectionStart = this.inputElement.selectionStart;
    const selectionEnd = this.inputElement.selectionEnd;
    const oldValue = this.inputElement.value;
    const selection = oldValue.substring(selectionStart, selectionEnd);
    return selection
      ? oldValue.replace(selection, key)
      : oldValue.substring(0, selectionStart) +
          key +
          oldValue.substring(selectionStart);
  }
}

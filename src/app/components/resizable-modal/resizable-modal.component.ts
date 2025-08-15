import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-resizable-modal',
  templateUrl: './resizable-modal.component.html',
  styleUrls: ['./resizable-modal.component.css']
})
export class ResizableModalComponent {
  isResizing = false;

  startResizing(event: MouseEvent) {
    this.isResizing = true;
    document.addEventListener('mousemove', this.resizeModal);
    document.addEventListener('mouseup', this.stopResizing);
  }

  resizeModal = (event: MouseEvent) => {
    if (this.isResizing) {
      const modal = document.querySelector('.modal') as HTMLElement;
      modal.style.width = `${event.clientX - modal.offsetLeft}px`;
      modal.style.height = `${event.clientY - modal.offsetTop}px`;
    }
  };

  stopResizing = () => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resizeModal);
    document.removeEventListener('mouseup', this.stopResizing);
  };

  closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay') as HTMLElement;
    modalOverlay.style.display = 'none';
  }
}

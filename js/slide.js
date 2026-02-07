export default class Slide {
  constructor(slide, holder) {
    this.slide = document.querySelector(slide);
    this.holder = document.querySelector(holder);
    this.dist = {
      finalposition: 0,
    };
  }
  bindEvents(eventoBindado) {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  onStart(event) {
    event.preventDefault();
    console.log(this);
    this.holder.addEventListener('mousemove', this.onMove);
  }
  onMove(event) {
    console.log(event);
  }

  onEnd() {
    this.holder.removeEventListener('mousemove', this.onMove);
  }

  addSlideEvents() {
    this.holder.addEventListener('mousedown', this.onStart);
    this.holder.addEventListener('mouseup', this.onEnd);
  }
  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}

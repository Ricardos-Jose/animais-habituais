export default class Slide {
  constructor(slide, holder) {
    this.slide = document.querySelector(slide);
    this.holder = document.querySelector(holder);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }
  updateDist(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let mousetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      mousetype = 'mousemove';
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      mousetype = 'touchmove';
    }
    this.holder.addEventListener(mousetype, this.onMove);
  }
  onMove(event) {
    const pointer =
      event.type === 'mousemove'
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updateDist(pointer);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.holder.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.holder.addEventListener('mousedown', this.onStart);
    this.holder.addEventListener('touchstart', this.onStart);
    this.holder.addEventListener('mouseup', this.onEnd);
    this.holder.addEventListener('touchend', this.onEnd);
  }
  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
  bindEvents(eventoBindado) {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
}

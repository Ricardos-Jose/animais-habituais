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
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.holder.addEventListener('mousemove', this.onMove);
  }
  onMove(event) {
    const finalPosition = this.updateDist(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd() {
    this.holder.removeEventListener('mousemove', this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
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
  bindEvents(eventoBindado) {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
}

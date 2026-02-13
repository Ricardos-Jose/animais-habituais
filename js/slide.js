import debounce from './debounce.js';

export default class Slide {
  constructor(slide, holder) {
    this.slide = document.querySelector(slide);
    this.holder = document.querySelector(holder);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'active';
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }
  updateDist(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }
  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
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
    this.transition(false);
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
    this.transition(true);
    this.changeSlideOnEnd();
  }
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined)
      this.activePrevSlide();
    else {
      this.changeSlide(this.index.active);
    }
  }
  addSlideEvents() {
    this.holder.addEventListener('mousedown', this.onStart);
    this.holder.addEventListener('touchstart', this.onStart);
    this.holder.addEventListener('mouseup', this.onEnd);
    this.holder.addEventListener('touchend', this.onEnd);
  }
  // Slide Config
  slidePosition(slide) {
    const margin = (this.holder.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }
  slideIndexNav(index) {
    const last = this.slideConfig.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  slideArray() {
    this.slideConfig = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { element, position };
    });
    console.log(this.slideConfig);
  }
  changeSlide(index) {
    const activeSlide = this.slideConfig[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.holder.dispatchEvent(this.changeEvent);
  }
  changeActiveClass() {
    this.slideConfig.forEach((item) =>
      item.element.classList.remove(this.activeClass),
    );
    this.slideConfig[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }
  onResize() {
    setTimeout(() => {
      this.slideArray();
      this.changeSlide(this.index.active);
    }, 1000);
  }
  addResize() {
    window.addEventListener('resize', this.onResize);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slideArray();
    this.addResize();
    this.changeSlide(0);
    return this;
  }
  bindEvents(eventoBindado) {
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
  }
}

export class SlideNav extends Slide {
  constructor(slide, holder) {
    super(slide, holder);
    this.bindControlEvents();
    this.changeEvent = new Event('changeEvent');
  }
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }
  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
    this.slideConfig.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
    });
    this.holder.appendChild(control);
    return control;
  }
  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.holder.addEventListener('changeEvent', this.activeControlItem);
  }
  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }
  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }

  activeControlItem() {
    this.controlArray.forEach((item) =>
      item.classList.remove(this.activeClass),
    );
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }
}

import Slide from './slide.js';
const slide = new Slide('.slide', '.holder');
slide.init();

slide.changeSlide(0);
slide.activePrevSlide();

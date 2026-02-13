import { SlideNav } from './slide.js';
const slide = new SlideNav('.slide', '.holder');
slide.init();

slide.addArrow('.prev', '.next');
slide.addControl('.custom-control');

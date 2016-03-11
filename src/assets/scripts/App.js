import SlipnSlider from './components/SlipnSlider';
import SliderForm from './views/slider-form';

export default class App {
  constructor() {
		this.createChildren();
    return this;
  }

  init() {
  	this.initSlider()
        .initSliderForm();
    return this;
  }

  createChildren() {
  	this.slipnsliderEl = document.querySelector('.slipnslider');
    this.formEl = document.querySelector('.js-sliderForm');
    return this;
  }

  initSlider() {
  	this.slipnSlider = new SlipnSlider(this.slipnsliderEl, {responsive: {400: {slidesPerPage:2}, 700: {slidesPerPage: 4} } });
  	this.slipnSlider.init();
    return this;
  }

  initSliderForm() {
    this.sliderForm = new SliderForm(this.formEl);
    this.sliderForm.init();
  }
}

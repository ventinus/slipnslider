import SlipnSlider from './components/SlipnSlider';

export default class App {
  constructor() {
		this.createChildren();
  }

  init() {
  	this.initSlider();
  }

  createChildren() {
  	this.slipnsliderEl = document.querySelector('.slipnslider');
  }

  initSlider() {
  	this.slipnSlider = new SlipnSlider(this.slipnsliderEl);
  	this.slipnSlider.init();
  }
}

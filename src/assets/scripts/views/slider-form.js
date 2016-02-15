import SlipnSlider from '../components/SlipnSlider';

export default class SliderForm {
	constructor(element) {
		this.element = element;
	}

	init() {
		this.createChildren()
				.addEventHandlers()
				.enable();

		return this
	}

	createChildren() {
		this.submitBtn = this.element.querySelector('input[type="submit"]');
		this.isInfinite = this.element.querySelector(".js-isInfinite");
		this.hasDotNav = this.element.querySelector(".js-hasDotNav");
		this.hasControls = this.element.querySelector(".js-hasControls");
		this.slidePadding = this.element.querySelector(".js-slidePadding");
		this.slidesPerPage = this.element.querySelector(".js-slidesPerPage");
		this.slipnsliderEl = window.app.slipnsliderEl || document.querySelector('.slipnslider');
		this.slipnslider = window.app.slipnSlider || new SlipnSlider(this.slipnsliderEl);
		return this;
	}

	addEventHandlers() {
		this.onSubmitHandler = this.onSubmit.bind(this);
		return this;
	}

	enable() {
		this.submitBtn.addEventListener('click', this.onSubmitHandler);
		return this;
	}

	onSubmit(e) {
		e.preventDefault();
		this.slipnslider.disable();

		// Get form fields values
		let options = {
			isInfinite: eval(this.isInfinite.selectedOptions[0].value),
			hasDotNav: eval(this.hasDotNav.selectedOptions[0].value),
      hasControls: eval(this.hasControls.selectedOptions[0].value),
      slidePadding: parseInt(this.slidePadding.value),
      slidesPerPage: parseInt(this.slidesPerPage.value)
		};

		this.slipnslider = new SlipnSlider(this.slipnsliderEl, options);
		this.slipnslider.init();
		return this;
	}
}

// Features to add:
//  autoplay, slides to show at a time, paging/how they transition (flowing behind
//  instead of strictly left and right)
//  currently takes about 7.6ms to tear down and rebuild in chrome
// - add option to not wrap when not infinite so nav btns get disabled at beginning and end

// =========================================================
// On Initialization functions
// =========================================================

const SlipnSlider = (element, options = {}) => {
  let props = {
    /**
     * Flag for detecting if slider is enabled
     * @type {Boolean}
     * @default false
     */
    isEnabled: false,

    /**
     * The list of options able to be set by user on slider
     * creation. If any property is left unset, it will default
     * to the option specified here.
     * @type {Object}
     */
    optionableProperties: {
      isInfinite: false,
      hasDotNav: true,
      hasControls: true,
      navContainer: element,
      dotsContainer: element,
      navText: ['prev', 'next'],
      slideElement: 'div',
      stageElement: 'div',
      slidePadding: 10,
      slidesPerPage: 1,
      prevNavigationCallback(direction) {
        // console.log(`prev callback: going ${direction}`);
      },
      nextNavigationCallback(direction) {
        // console.log(`next callback: going ${direction}`);
      },
      dotClickCallback(prevIndex, nextIndex) {

      },
      responsive: {}
    },
    /**
     * Collection of breakpoints specified through options
     * @type {Array}
     */
    breakpoints: [],

    /**
     * Current minimum width breakpoint
     * @type {Number}
     */
    currentBreakpoint: 0,

    /**
     * User options object of settable properties
     * @type {Object}
     */
    options: options,

    /**
     * Class of the slider istance for selecting slider element
     * @type {String}
     */
    slider: element,

    /**
     * The amount of slides in slider
     * @type {Number}
     */
    total: 0,

    /**
     * Calculation of the width of each slide in percent
     * @type {Number}
     * @default 0
     */
    slideWidth: 0,

    /**
     * The amount of dots created for navigation
     * @type {Number}
     * @default 0
     */
    dotsCount: 0,

    /**
     * Value of amount the slider shifts by. Gets set to the
     * width of a slide and the slidePadding to the left.
     * @type {Number}
     * @default 0
     */
    slideBy: 0,

    /**
     * Index number of the current active slide
     * @type {Number}
     * @default 0
     */
    activeSlideIndex: 0,

    /**
     * Index number of the current active nav dot
     * @type {Number}
     * @default 0
     */
    activeDotIndex: 0,

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    pressStart: '',

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    pressEnd: '',

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    pressMove: '',

    /**
     * Flag for determining if slide is transitioning
     * to another slide
     * @type {Boolean}
     * @default false
     */
    isTransitioning: false,

    /**
     * Classname for adding visibility of dots
     * @type {String - CSS class}
     */
    dotIsActive: 'slipnslider__active',

    /**
     * Accurate vendor prefix for adding event listener
     * for transitionEnd event. From Modernizr
     * @type {String}
     */
    transitionEndPrefix: '',

    /**
     * Vendor prefix for transition
     * @type {String}
     */
    transitionPrefix: '',

    /**
     * Vendor prefix for transform
     * @type {String}
     */
    transformPrefix: '',

    /**
     * The Y position of the touch point to maintain
     * scrolling on touch devices
     * @type {Number}
     * @default 0
     */
    curYPos: 0,

    /**
     * Caches the value of the x coordinate
     * when the user clicks/touches to drag slider
     * @type {Number}
     * @default 0
     */
    startpoint: 0,

    /**
     * Flag for determining if slider is being dragged
     * @type {Boolean}
     * @default false
     */
    isDragging: false,

    /**
     * Minimum pixel amount to drag slider to
     * initiate slide change. Gets set to 25% of the
     * stage width
     * @type {Number}
     * @default 30
     */
    dragThreshold: 30,

    /**
     * Flag to determine if the user has dragged
     * beyond the horizontal threshold. Necessary for
     * touch devices only
     * @type {Boolean}
     * @default false
     */
    brokeHorizontalThreshold: false,

    /**
     * [wasDragged description]
     * @type {Boolean}
     */
    wasDragged: false,

    /**
     * Flag for determining if device is mobile or desktop.
     * Defined by whether the device supports touch events
     * @type {Boolean}
     */
    isMobileDevice: false,

    /**
     * Flag for determining if device is android. Touch event
     * data is different between iOs and android
     * @type {Boolean}
     */
    isAndroid: false
  };

  /**
   * Parses through the options object provided by the user
   * and sets the properties accordingly. Verifies that option
   * is one that can be set by the user and checks the typeof
   * the option for proper and desired behaviour.
   * @return {SlipnSlider}
   */
  const takeUserOptions = () => {
    props.options = props.options || {};
    for (let option in props.optionableProperties) {
      if (props.optionableProperties.hasOwnProperty(option)) {

        if (props.optionableProperties[option] !== undefined && typeof props.optionableProperties[option] === typeof props.options[option]) {
          props[option] = props.options[option];
        } else {
          props[option] = props.optionableProperties[option];
        }
      }
    }

    return;
  }

  /**
   * Runs through the breakpoints specified in the responsive property, stores
   * each breakpoint and finds which breakpoint we are currently in.
   * @return {Slipnslider}
   */
  const parseResponsive = () => {
    let windowWidth = window.innerWidth;
    for (let breakpoint in props.responsive) {
      if (props.responsive.hasOwnProperty(breakpoint)) {
        breakpoint = +breakpoint;
        props.breakpoints.push(breakpoint);
        if (breakpoint < windowWidth) {
          props.currentBreakpoint = breakpoint;
        }
      }
    }

    if (props.breakpoints.length === 0) {
      return;
    }

    applyCurrentBreakptProps();

    return;
  }

  /**
   * Overwrites any defaults or options set with the options
   * specified for the current breakpoint.
   * @return {Slipnslider}
   */
  const applyCurrentBreakptProps = () => {
    for (let item in props.responsive[props.currentBreakpoint]) {
      if (typeof props.responsive[props.currentBreakpoint][item] === typeof props[item]) {
        props[item] = props.responsive[props.currentBreakpoint][item];
      }
    }

    return;
  }

  /**
   * Clones the first and last slide and appends each
   * to the opposite end of the slider to have that
   * oh so pleasurable infinite feel. Updates the values
   * of the slide elements, total count, percent width,
   * and sets the activeSlideIndex to 1.
   * @return {SlipnSlider}
   */
  const setupInfiniteSlider = () => {
    if (!props.isInfiniteOverride) {
      return;
    }

    let times = props.slidesPerPage + 1;
    for (let i = 0; i < times; i++) {
      let slide = props.slides[i].cloneNode(true);
      props.stage.appendChild(slide);
    }

    let lastSlideIndex = props.total - 1;
    for (let i = lastSlideIndex; i > lastSlideIndex - times; i--) {
      let slide = props.slides[lastSlideIndex].cloneNode(true);
      props.stage.insertBefore(slide, props.slides[0]);
    }

    props.total = props.slides.length;
    props.activeSlideIndex = props.slidesPerPage + 1;

    // need additional dots for more than 1 slide per page
    if (props.slidesPerPage > 1) {
      for (let i = 0, j = props.slidesPerPage - 1; i < j; i++) {
        props.dotNav.appendChild(document.createElement('li'));
        props.dotsCount++;
      }
    }
    // Recache the dots
    props.navDots = props.dotNav.children;
    props.dotsCount = props.navDots.length;

    return;
  }

  /**
   * Wraps the slides with the stage and appends it
   * to the slider. Updates the values of slide elements,
   * total count, percentage, and sets the width of the slides.
   * @return {SlipnSlider}
   */
  const setStage = () => {
    let stage = document.createElement(props.stageElement);
    stage.className = 'slipnslider__stage';
    props.slides = props.slider.children;
    props.total = props.slides.length;

    for (let i = 0; i < props.total; i++) {
      stage.appendChild(props.slides[0]);
    }

    props.slider.appendChild(stage);
    props.stage = props.slider.children[0];
    props.slides = props.stage.children;

    return;
  }

  /**
   * Checks if there are enough slides for the desired setup
   * to prevent odd and unwanted behaviour
   * @return {Slipnslider}
   */
  const calcInitialProps = () => {
    // Dont allow slides per page to exceed the total amount of slides
    if (props.slidesPerPage > props.total) { props.slidesPerPage = props.total; }
    props.dotsCount = props.total - (props.slidesPerPage - 1);

    // Disallow nav and infinite becaause there is nowhere to go
    if (props.dotsCount <= 1) {
      props.hasDotNavOverride = false;
      props.hasControlsOverride = false;
      props.isInfiniteOverride = false;
      return;
    } else {
      props.hasDotNavOverride = props.hasDotNav;
      props.hasControlsOverride = props.hasControls;
      props.isInfiniteOverride = props.isInfinite;
    }

    return;
  }



  /**
   * Creates the DOM elements with instance-specific class names
   * for dot navigation. Sets active class to current slide and
   * appends dotNav to the slider
   * @return {SlipnSlider}
   */
  const createDots = () => {
    const targetElement = findElement(props.dotsContainer)

    props.dotNav = document.createElement('ul');
    props.dotNav.className = 'slipnslider__dot-nav';
    for (let i = 0; i < props.dotsCount; i++) {
      props.dotNav.appendChild(document.createElement('li'));
    }
    props.navDots = props.dotNav.querySelectorAll('li');
    props.activeDot = props.navDots[props.activeSlideIndex];
    props.activeDot.className = props.dotIsActive;
    targetElement.appendChild(props.dotNav);

    const dispStyle = !props.hasDotNavOverride ? 'none' : '';
    props.dotNav.style.display = dispStyle;

    return;
  }

  /**
   * Searches for an optionally provided element to
   * append controls wrapper to. Creates a controls
   * wrapping element and appends the prev and next
   * buttons as children and caches them as properties
   * of the slider.
   * @return {SlipnSlider}
   */
  const createControls = () => {
    if (!props.hasControlsOverride || props.total === 1) {
      return props;
    }
    const targetElement = findElement(props.navContainer)
    const [prevText, nextText] = props.navText

    let controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'slipnslider__controls';
    props.prevBtn = document.createElement('button');
    props.prevBtn.className = 'slipnslider__prev';
    props.prevBtn.type = 'button';
    props.prevBtn.innerHTML = prevText.length === 0 ? '<span class="is-visually-hidden">previous</span>' : prevText;
    props.nextBtn = document.createElement('button');
    props.nextBtn.className = 'slipnslider__next';
    props.nextBtn.type = 'button';
    props.nextBtn.innerHTML = nextText.length === 0 ? '<span class="is-visually-hidden">next</span>' : nextText;
    controlsWrapper.appendChild(props.prevBtn);
    controlsWrapper.appendChild(props.nextBtn);
    targetElement.appendChild(controlsWrapper);

    return;
  }

  /**
   * Enables the slider and adds the event listeners
   * @return {SlipnSlider}
   */
  const enable = () => {
    if (props.isEnabled) {
      return;
    }

    props.isEnabled = true;

    // Prevent event handlers from being set if there aren't
    // any other slides to slide to
    window.addEventListener('resize', onWindowResize, false);

    if (props.dotsCount <= 1) {
      return;
    }

    if (props.hasControlsOverride) {
      props.nextBtn.addEventListener('click', onNextClickHandler, false);
      props.prevBtn.addEventListener('click', onPrevClickHandler, false);
    }

    if (props.hasDotNavOverride) {
      for (let i = 0, j = props.navDots.length; i < j; i++) {
        props.navDots[i].addEventListener('click', onDotClick, false);
      }
    }

    props.stage.addEventListener(props.pressStart, onDragStart, false);
    props.stage.addEventListener('click', onSliderClick, false);

    window.addEventListener(props.pressMove, onDrag, false);
    window.addEventListener(props.pressEnd, offDrag, false);

    // check for not mobile to attach keystroke eventhandler
    if (!props.isMobileDevice) {
      window.addEventListener('keydown', onKeyDown, false);
    }

    return;
  }


  /**
   * Disables the slider by removing the event listeners
   * and restores the slider to initial state before
   * intialization of the slider
   * @return {SlipnSlider}
   */
  const disable = () => {
    if (!props.isEnabled) {
      return;
    }

    props.isEnabled = false;

    if (props.hasControlsOverride) {
      props.nextBtn.removeEventListener('click', onNextClickHandler, false);
      props.prevBtn.removeEventListener('click', onPrevClickHandler, false);
    }

    if (props.hasDotNavOverride) {
      for (let i = 0, j = props.navDots.length; i < j; i++) {
        props.navDots[i].removeEventListener('click', onDotClick, false);
      }
    }

    props.stage.removeEventListener(props.pressStart, onDragStart, false);
    props.stage.removeEventListener('click', onSliderClick, false);

    window.removeEventListener(props.pressMove, onDrag, false);
    window.removeEventListener(props.pressEnd, offDrag, false);
    window.removeEventListener('resize', onWindowResize, false);

    if (!props.isMobileDevice) {
      window.removeEventListener('keydown', onKeyDown, false);
    }

    removeCreatedElements();

    return;
  }

  /**
   * Removes all the created elements from initialization
   * and restores intial states.
   * @return {SlipnSlider}
   */
  const removeCreatedElements = () => {
    if (props.hasControlsOverride) {
      // controls may be appended elsewhere
      props.prevBtn.parentElement.parentElement.removeChild(props.prevBtn.parentElement);
    }

    props.dotNav.parentElement.removeChild(props.dotNav);

    if (props.isInfiniteOverride) {
      // need to remove the last ones first otherwise the props.total
      // number wont be accurate
      let count = props.slidesPerPage + 1;
      for (let i = props.total - 1, j = props.total - 1 - count; i > j; i--) {
        props.stage.removeChild(props.slides[i]);
      }
      for (let i = 0; i < count; i++) {
        props.stage.removeChild(props.slides[0]);
      }

      props.total -= count * 2;
    }

    for (let i = 0, j = 0; i < props.total; i++) {
      props.slides[j].style.width = '100%';
      props.slides[j].style.marginLeft = '0';
      props.slider.appendChild(props.slides[j]);
    }

    props.slider.removeChild(props.stage);
    props.slider.display = 'none';
    return;
  }

  // =========================================================
  // Event Listeners
  // =========================================================

  /**
   * Ensures to preventDefault when the slides are anchor tags and
   * the slider had been dragged and released while still above the slider
   * @param  {Object} e Event click data
   * @return {Slipnslider}
   */
  const onSliderClick = (e) => {
    if (props.wasDragged) {
      e.preventDefault();
    }

    props.wasDragged = false;

    return;
  }

  /**
   * Checks for when the user enters a different breakpoint
   * and decides to rebuild the slider
   * @return {Slipnslider}
   */
  const onWindowResize = (e) => {
    defineSizes();
    if (props.breakpoints.length === 0) {
      return;
    }

    let currentBreakIndex = props.breakpoints.indexOf(props.currentBreakpoint);
    let windowWidth = window.innerWidth;

    if (windowWidth >= props.breakpoints[currentBreakIndex + 1]) {
      props.currentBreakpoint = props.breakpoints[currentBreakIndex + 1];
      rebuildSlider();
    } else if (currentBreakIndex > 0 && windowWidth < props.breakpoints[currentBreakIndex]) {
      props.currentBreakpoint = props.breakpoints[currentBreakIndex - 1];
      rebuildSlider();
    }

    return;
  }

  /**
   * Disables and resets current slide and dot indices back
   * to the beginning and runs most of the init functions
   * except for the parsing options function
   * @return {Slipnslider}
   */
  const rebuildSlider = () => {
    props.activeSlideIndex = props.activeDotIndex = 0;
    disable();
    applyCurrentBreakptProps();
    setStage();
    calcInitialProps();
    createDots();
    createControls();
    setupInfiniteSlider();
    defineSizes();
    navigateToSlide();
    addStageTransition();
    bindTransitionEvents();
    enable();

    return;
  }

  /**
   * Sets the width of the slider stage as well as
   * the contained slides
   * @return {SlipnSlider}
   */
  const defineSizes = () => {
    removeStageTransition();
    let totalPadding = (props.total - 1) * props.slidePadding;
    props.slideWidth = Math.ceil((props.slider.offsetWidth - (props.slidePadding * (props.slidesPerPage - 1))) / props.slidesPerPage);
    let stageWidth = (props.total * props.slideWidth) + totalPadding;
    props.stage.style.width = `${stageWidth}px`;
    props.dragThreshold = props.slider.offsetWidth / 4;
    props.slideBy = props.slideWidth + props.slidePadding;

    // TODO: check if props.total is the same as props.slides.length
    for (let i = 0, j = props.slides.length; i < j; i++) {
      props.slides[i].style.width = `${props.slideWidth}px`;
      props.slides[i].style.marginLeft = `${props.slidePadding}px`;
    }

    navigateToSlide();
    addStageTransition();
    return;
  }

  /**
   * Navigates the slider to an adjacent slide. Wraps
   * to opposite end if slider is not in infinite mode
   * and default behaviour is to increment or decrement
   * based on value of direction.
   * @param  {Boolean} direction True navigates forward and False navigates backwards
   * @param  {Event Obj} e       Optional event data
   * @return {SlipnSlider}
   */
  const determineAction = (direction, e) => {
    if (props.isTransitioning) {
      return;
    }

    onTransitionStart();

    if (direction) {
      props.nextNavigationCallback(direction);
    } else {
      props.prevNavigationCallback(direction);
    }

    if (direction && atLastSlide()) {
      props.activeDotIndex = 0;
      if (!props.isInfiniteOverride) {
        props.activeSlideIndex = 0;
      } else {
        props.activeSlideIndex++;
      }
    } else if (!direction && atFirstSlide()) {
      props.activeDotIndex = props.dotsCount - 1;
      if (!props.isInfiniteOverride) {
        props.activeSlideIndex = props.dotsCount - 1;
      } else {
        props.activeSlideIndex--;
      }
      // Using dotsCount because total will cause it to navigate beyond the slides
      // when multiple slides per page
    } else {
      if (direction) {
        props.activeSlideIndex++;
        props.activeDotIndex++;
      } else {
        props.activeSlideIndex--;
        props.activeDotIndex--;
      }
    }

    navigateToSlide();

    return;
  }

  /**
   * Action to execute when left and right arrows are
   * pressed for navigation.
   * @param  {Event Obj} e Event data for the keydown event
   * @return {SlipnSlider}
   */
  const onKeyDown = (e) => {
    if (e.srcElement.localName !== 'body') {
      return;
    }
    // might want to have a debounce to limit calls but behaves
    // as anticipated and isnt too overloading
    if (event.keyCode === 37) {
      determineAction(false);
    } else if (e.keyCode === 39) {
      determineAction(true);
    }

    return;
  }

  /**
   * Finds the slide to navigate to corresponding to the
   * index number of the clicked dot. Sets the activeSlideIndex
   * to the target slide index.
   * @param  {Event Obj} e Event click data
   * @return {SlipnSlider}
   */
  const onDotClick = (e) => {
    e.preventDefault();
    if (props.isTransitioning) {
      return;
    }

    let dotIndex = Array.prototype.indexOf.call(props.navDots, e.currentTarget);

    if (dotIndex === props.activeDotIndex) {
      return;
    }

    props.dotClickCallback(props.activeDotIndex, dotIndex)
    onTransitionStart();
    props.activeDotIndex = props.activeSlideIndex = dotIndex;

    if (props.isInfiniteOverride) {
      props.activeSlideIndex += props.slidesPerPage + 1;
    }

    navigateToSlide();

    return;
  }

  /**
   * Event listener for the start of dragging the slider. Stores the
   * current x coordinate and the y coordinate of device is a touch device
   * so that scrolling is still possible.
   * @param  {Event Obj} e Event touch/click data
   * @return {SlipnSlider}
   */
  const onDragStart = (e) => {
    if (props.isTransitioning) {
      return;
    }

    removeStageTransition();
    props.isDragging = true;

    let eData = props.isAndroid ? e.touches[0] : e;

    if (props.isMobileDevice) {
      props.brokeHorizontalThreshold = false;
      props.curYPos = eData.pageY;
    }

    props.startpoint = eData.pageX;

    return;
  }

  /**
   * Handles moving the slider according to users movements
   * and scrolling if on a touch device. Prevents slider
   * from moving beyond the first and last slide if not
   * in infinite mode.
   * @param  {Event Obj} e Event Drag data
   * @return {SlipnSlider}
   */
  const onDrag = (e) => {
    if (props.isTransitioning || !props.isDragging) {
      return;
    }
    let eData = props.isAndroid ? e.changedTouches[0] : e;
    // flag for preventing default click event when slides are anchor tags
    props.wasDragged = true;


    if (props.isMobileDevice) {
      // Check to see if user is moving more vertically than horizontally
      // to then disable the drag
      let yMvt = Math.abs(props.curYPos - eData.pageY);
      let xMvt = Math.abs(props.startpoint - eData.pageX);
      if (xMvt > 20) {
        props.brokeHorizontalThreshold = true;
        e.preventDefault();
      }
      if (!props.brokeHorizontalThreshold) {
        if (xMvt <= 20 && yMvt >= 10 && yMvt > xMvt) {
          props.isDragging = false;
          props.stage.style[props.transitionPrefix] = 'all .75s';
          navigateToSlide();
          return;
        }
      }
    }

    let currentPos = ((props.activeSlideIndex * props.slideWidth) + (props.slidePadding * props.activeSlideIndex)) * -1;
    let movePos = currentPos - ((props.startpoint - eData.pageX) * 0.7);

    if (!props.isInfiniteOverride) {
      // Dividing by 4 and multiplying by 0.75 allows a
      // peek over either end by a quarter of slide width
      if (movePos >= props.slider.offsetWidth / 4) {
        movePos = props.slider.offsetWidth / 4;
      } else if (movePos <= -props.stage.offsetWidth + (props.slider.offsetWidth * 0.75)) {
        movePos = -props.stage.offsetWidth + (props.slider.offsetWidth * 0.75);
      }
    }

    props.stage.style[props.transformPrefix] = `translate3d(${movePos}px, 0, 0)`;

    return;
  }

  /**
   * Reinstantiates the stage transition and determines
   * if and which slide to move to based on the ending
   * x coordinate and the startpoint
   * @param  {Event Obj} e Event data from touchup/mouseup
   * @return {SlipnSlider}
   */
  const offDrag = (e) => {
    if (!props.isDragging) {
      return;
    }
    // if (props.isAndroid) { e.preventDefault(); }
    props.isDragging = false;
    props.stage.style[props.transitionPrefix] = 'all .75s';
    let eData = props.isAndroid ? e.changedTouches[0] : e;
    let travelled = e !== undefined ? props.startpoint - eData.pageX : 0;

    if (Math.abs(travelled) >= props.dragThreshold) {
      if (props.isInfiniteOverride) {
        if (travelled > 0) {
          determineAction(true);
        } else {
          determineAction(false);
        }
      } else {
        if (travelled < 0 && !atFirstSlide()) {
          determineAction(false);
        } else if (travelled > 0 && !atLastSlide()) {
          determineAction(true);
        } else {
          navigateToSlide();
        }
      }
    } else {
      navigateToSlide();
    }

    return;
  }

  /**
   * Sets isTransitioning flag to true to disable
   * user interaction
   * @return {SlipnSlider}
   */
  const onTransitionStart = () => {
    props.isTransitioning = true;
    return;
  }

  /**
   * Listener for resetting the isTransitioning
   * flag to false after slider is finished making
   * its' way to the target slide
   * @return {SlipnSlider}
   */
  const onTransitionEnd = () => {
    props.isTransitioning = false;
    if (props.isInfiniteOverride) {
      checkForSlideSwap();
    }

    return;
  }

  /**
   * Binds the transition end event to the stage and executes an
   * optional callback function
   * @param  {Function} callback Optional callback to execute on transition completion
   * @return {SlipnSlider}
   */
  const bindTransitionEvents = (callback) => {
    if (props.transitionEndPrefix) {
      props.stage.addEventListener(props.transitionEndPrefix, (event, callback) => {
        if (callback) { callback(); }
        onTransitionEnd();
      }, false);
    }

    return;
  }

  // =========================================================
  // Utility functions
  // =========================================================

  /**
   * Calculates the amount to reposition the slider
   * to move to the current activeSlideIndex. If there
   * is a dotNav, updates the classes of the previous active
   * dot and the new one.
   * @return {SlipnSlider}
   */
  const navigateToSlide = () => {
    let moveTo = props.activeSlideIndex * props.slideBy;

    props.stage.style[props.transformPrefix] = `translate3d(-${moveTo}px,0,0)`;
    if (props.hasDotNavOverride) {
      props.activeDot.className = '';
      props.activeDot = props.navDots[props.activeDotIndex];
      props.activeDot.className = props.dotIsActive;
    }

    return;
  }

  /**
   * Called on isInfinite mode to see if current
   * slide is a cloned one. If so, switches to its
   * uncloned brother
   * @return {SlipnSlider}
   */
  const checkForSlideSwap = () => {
    if (props.activeDotIndex > 0 && props.activeSlideIndex <= props.slidesPerPage) {
      swapSlides(true);
    } else if (props.activeDotIndex === 0 && props.activeSlideIndex >= props.total - props.slidesPerPage - 1) {
      swapSlides(false);
    }
    return;
  }

  /**
   * Handles the actual switcharoo of between a cloned
   * slide and its brother by updated the activeSlideIndex,
   * removes the transition time, navigates to the new slide,
   * and restores transition time.
   * @param  {Boolean} direction True navigates to last uncloned slide, false to first uncloned slide
   * @return {SlipnSlider}
   */
  const swapSlides = (direction) => {
    let slidesPerPageShift = props.slidesPerPage + 1;
    props.activeSlideIndex = direction ? props.total - slidesPerPageShift - 1 : slidesPerPageShift;
    removeStageTransition();
    navigateToSlide();
    addStageTransition();

    return;
  }

  /**
   * Use for getting dotsContainer and navContainer
   * @param  {DOM Element or string} el default value is slider, but can be a
   *                                 DOM node or string to run querySelector by
   * @return {Object}    DOM node
   */
  const findElement = el => {
    let targetElement
    if (props.slider === el) {
      targetElement = el
    } else {
      targetElement = el.classList ? el : document.querySelector(el)
    }

    return targetElement
  }

  /**
   * Sets the stage transition to 0 seconds
   * @return {SlipnSlider}
   */
  const removeStageTransition = () => {
    props.stage.style[props.transitionPrefix] = 'all 0s';
    return;
  }

  /**
   * Sets stage transition to default value after 1ms
   * timeout so that there is a delay when chaining
   * @return {SlipnSlider}
   */
  const addStageTransition = () => {
    setTimeout(() => {
      props.stage.style[props.transitionPrefix] = 'all .75s';
    }, 1);
    return;
  }

  /**
   * Checks to see if slider is in the first position
   * @return {Boolean} returns true is at first position
   */
  const atFirstSlide = () => {
    return (props.activeDotIndex === 0) ? true : false;
  }

  /**
   * Checks to see if slider is in the last position
   * @return {Boolean} returns true if at last position
   */
  const atLastSlide = () => {
    return (props.activeDotIndex === props.dotsCount - 1) ? true : false;
  }

  /**
   * Loops through the prefixes for transitionend to grab
   * the correct prefix for the current browser. From Modernizr
   * @return {String} transitionend prefix for current browser
   */
  const transitionEndEvent = () => {
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  /**
   * Retrieves the correct transition prefix with what
   * exists in the users browser
   * @return {String} Transition Prefix
   */
  const transitionPrefix = () => {
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition': 'transition',
      'OTransition': 'oTransition',
      'MozTransition': 'transition',
      'WebkitTransition': 'webkitTransition'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  /**
   * Retrieves the correct transform prefix
   * with what exists in the users browser
   * @return {String} Transform Prefix
   */
  const transformPrefix = () => {
    let t;
    let el = document.createElement('fakeelement');
    let transforms = {
      'transform': 'transform',
      'OTransform': 'oTransform',
      'MozTransform': 'mozTransform',
      'WebkitTransform': 'webkitTransform'
    };

    for (t in transforms) {
      if (el.style[t] !== undefined) {
        return transforms[t];
      }
    }
  }

  const determineBrowserEvents = () => {
    let start, end, move;
    if ('ontouchstart' in window) {
      start = 'touchstart';
      end = 'touchend';
      move = 'touchmove';
      props.isMobileDevice = true;
      if (navigator.userAgent.match(/Android/i)) { props.isAndroid = true; }
    } else if (window.PointerEvent) {
      start = 'pointerdown';
      end = 'pointerup';
      move = 'pointermove';
    } else if (window.MSPointerEvent) {
      start = 'MSPointerDown';
      end = 'MSPointerUp';
      move = 'MSPointerMove';
    } else {
      start = 'mousedown';
      end = 'mouseup';
      move = 'mousemove';
    }

    props.pressStart = start;
    props.pressEnd = end;
    props.pressMove = move;

    return;
  }

  const getTransitionPrefixes = () => {
    props.transitionEndPrefix = transitionEndEvent();
    props.transitionPrefix = transitionPrefix();
    props.transformPrefix = transformPrefix();
    return;
  }

  const onNextClickHandler = determineAction.bind(null, true);
  const onPrevClickHandler = determineAction.bind(null, false);


  // =========================================================
  // Initialization function
  // =========================================================
  return {
    /**
     * Initialization function for setting up
     * and enabling the slider
     * @return {SlipnSlider}
     */
    init: () => {
      if (!props.slider) {
        console.warn("Slider element is not found or parameter is missing.\nSlipnSlider initialization aborted.");
        return;
      }

      // console.time("init");

      getTransitionPrefixes();
      determineBrowserEvents();
      takeUserOptions();
      parseResponsive();
      setStage();
      calcInitialProps();
      createDots();
      createControls();
      setupInfiniteSlider();
      defineSizes();
      navigateToSlide();
      addStageTransition();
      bindTransitionEvents();
      enable();


      // console.timeEnd("init");
      return;
    },
    enable: enable,
    disable: disable
  }
}

export default SlipnSlider;

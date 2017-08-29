(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// Features to add:
//  autoplay, slides to show at a time, paging/how they transition (flowing behind
//  instead of strictly left and right)
//  currently takes about 7.6ms to tear down and rebuild in chrome
// - add option to not wrap when not infinite so nav btns get disabled at beginning and end

// =========================================================
// On Initialization functions
// =========================================================

var SlipnSlider = function SlipnSlider(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var props = {
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
      prevNavigationCallback: function prevNavigationCallback(direction) {
        // console.log(`prev callback: going ${direction}`);
      },
      nextNavigationCallback: function nextNavigationCallback(direction) {
        // console.log(`next callback: going ${direction}`);
      },
      dotClickCallback: function dotClickCallback(prevIndex, nextIndex) {},

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
  var takeUserOptions = function takeUserOptions() {
    props.options = props.options || {};
    for (var option in props.optionableProperties) {
      if (props.optionableProperties.hasOwnProperty(option)) {

        if (props.optionableProperties[option] !== undefined && _typeof(props.optionableProperties[option]) === _typeof(props.options[option])) {
          props[option] = props.options[option];
        } else {
          props[option] = props.optionableProperties[option];
        }
      }
    }

    return;
  };

  /**
   * Runs through the breakpoints specified in the responsive property, stores
   * each breakpoint and finds which breakpoint we are currently in.
   * @return {Slipnslider}
   */
  var parseResponsive = function parseResponsive() {
    var windowWidth = window.innerWidth;
    for (var breakpoint in props.responsive) {
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
  };

  /**
   * Overwrites any defaults or options set with the options
   * specified for the current breakpoint.
   * @return {Slipnslider}
   */
  var applyCurrentBreakptProps = function applyCurrentBreakptProps() {
    for (var item in props.responsive[props.currentBreakpoint]) {
      if (_typeof(props.responsive[props.currentBreakpoint][item]) === _typeof(props[item])) {
        props[item] = props.responsive[props.currentBreakpoint][item];
      }
    }

    return;
  };

  /**
   * Clones the first and last slide and appends each
   * to the opposite end of the slider to have that
   * oh so pleasurable infinite feel. Updates the values
   * of the slide elements, total count, percent width,
   * and sets the activeSlideIndex to 1.
   * @return {SlipnSlider}
   */
  var setupInfiniteSlider = function setupInfiniteSlider() {
    if (!props.isInfiniteOverride) {
      return;
    }

    var times = props.slidesPerPage + 1;
    for (var i = 0; i < times; i++) {
      var slide = props.slides[i].cloneNode(true);
      props.stage.appendChild(slide);
    }

    var lastSlideIndex = props.total - 1;
    for (var _i = lastSlideIndex; _i > lastSlideIndex - times; _i--) {
      var _slide = props.slides[lastSlideIndex].cloneNode(true);
      props.stage.insertBefore(_slide, props.slides[0]);
    }

    props.total = props.slides.length;
    props.activeSlideIndex = props.slidesPerPage + 1;

    // need additional dots for more than 1 slide per page
    if (props.slidesPerPage > 1) {
      for (var _i2 = 0, j = props.slidesPerPage - 1; _i2 < j; _i2++) {
        props.dotNav.appendChild(document.createElement('li'));
        props.dotsCount++;
      }
    }
    // Recache the dots
    props.navDots = props.dotNav.children;
    props.dotsCount = props.navDots.length;

    return;
  };

  /**
   * Wraps the slides with the stage and appends it
   * to the slider. Updates the values of slide elements,
   * total count, percentage, and sets the width of the slides.
   * @return {SlipnSlider}
   */
  var setStage = function setStage() {
    var stage = document.createElement(props.stageElement);
    stage.className = 'slipnslider__stage';
    props.slides = props.slider.children;
    props.total = props.slides.length;

    for (var i = 0; i < props.total; i++) {
      stage.appendChild(props.slides[0]);
    }

    props.slider.appendChild(stage);
    props.stage = props.slider.children[0];
    props.slides = props.stage.children;

    return;
  };

  /**
   * Checks if there are enough slides for the desired setup
   * to prevent odd and unwanted behaviour
   * @return {Slipnslider}
   */
  var calcInitialProps = function calcInitialProps() {
    // Dont allow slides per page to exceed the total amount of slides
    if (props.slidesPerPage > props.total) {
      props.slidesPerPage = props.total;
    }
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
  };

  /**
   * Creates the DOM elements with instance-specific class names
   * for dot navigation. Sets active class to current slide and
   * appends dotNav to the slider
   * @return {SlipnSlider}
   */
  var createDots = function createDots() {
    var targetElement = findElement(props.dotsContainer);

    props.dotNav = document.createElement('ul');
    props.dotNav.className = 'slipnslider__dot-nav';
    for (var i = 0; i < props.dotsCount; i++) {
      props.dotNav.appendChild(document.createElement('li'));
    }
    props.navDots = props.dotNav.querySelectorAll('li');
    props.activeDot = props.navDots[props.activeSlideIndex];
    props.activeDot.className = props.dotIsActive;
    targetElement.appendChild(props.dotNav);

    var dispStyle = !props.hasDotNavOverride ? 'none' : '';
    props.dotNav.style.display = dispStyle;

    return;
  };

  /**
   * Searches for an optionally provided element to
   * append controls wrapper to. Creates a controls
   * wrapping element and appends the prev and next
   * buttons as children and caches them as properties
   * of the slider.
   * @return {SlipnSlider}
   */
  var createControls = function createControls() {
    if (!props.hasControlsOverride || props.total === 1) {
      return props;
    }
    var targetElement = findElement(props.navContainer);

    var _props$navText = slicedToArray(props.navText, 2),
        prevText = _props$navText[0],
        nextText = _props$navText[1];

    var controlsWrapper = document.createElement('div');
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
  };

  /**
   * Enables the slider and adds the event listeners
   * @return {SlipnSlider}
   */
  var enable = function enable() {
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
      for (var i = 0, j = props.navDots.length; i < j; i++) {
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
  };

  /**
   * Disables the slider by removing the event listeners
   * and restores the slider to initial state before
   * intialization of the slider
   * @return {SlipnSlider}
   */
  var disable = function disable() {
    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return function () {
      if (!props.isEnabled) {
        return;
      }

      if (props.hasControlsOverride) {
        props.nextBtn.removeEventListener('click', onNextClickHandler, false);
        props.prevBtn.removeEventListener('click', onPrevClickHandler, false);
      }

      if (props.hasDotNavOverride) {
        for (var i = 0, j = props.navDots.length; i < j; i++) {
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

      if (deep) {
        removeCreatedElements();
      }

      props.isEnabled = false;

      return;
    };
  };

  /**
   * Removes all the created elements from initialization
   * and restores intial states.
   * @return {SlipnSlider}
   */
  var removeCreatedElements = function removeCreatedElements() {
    if (props.hasControlsOverride) {
      // controls may be appended elsewhere
      props.prevBtn.parentElement.parentElement.removeChild(props.prevBtn.parentElement);
    }

    props.dotNav.parentElement.removeChild(props.dotNav);

    if (props.isInfiniteOverride) {
      // need to remove the last ones first otherwise the props.total
      // number wont be accurate
      var count = props.slidesPerPage + 1;
      for (var i = props.total - 1, j = props.total - 1 - count; i > j; i--) {
        props.stage.removeChild(props.slides[i]);
      }
      for (var _i3 = 0; _i3 < count; _i3++) {
        props.stage.removeChild(props.slides[0]);
      }

      props.total -= count * 2;
    }

    for (var _i4 = 0, _j = 0; _i4 < props.total; _i4++) {
      props.slides[_j].style.width = '100%';
      props.slides[_j].style.marginLeft = '0';
      props.slider.appendChild(props.slides[_j]);
    }

    props.slider.removeChild(props.stage);
    props.slider.display = 'none';
    return;
  };

  // =========================================================
  // Event Listeners
  // =========================================================

  /**
   * Ensures to preventDefault when the slides are anchor tags and
   * the slider had been dragged and released while still above the slider
   * @param  {Object} e Event click data
   * @return {Slipnslider}
   */
  var onSliderClick = function onSliderClick(e) {
    if (props.wasDragged) {
      e.preventDefault();
    }

    props.wasDragged = false;

    return;
  };

  /**
   * Checks for when the user enters a different breakpoint
   * and decides to rebuild the slider
   * @return {Slipnslider}
   */
  var onWindowResize = function onWindowResize(e) {
    defineSizes();
    if (props.breakpoints.length === 0) {
      return;
    }

    var currentBreakIndex = props.breakpoints.indexOf(props.currentBreakpoint);
    var windowWidth = window.innerWidth;

    if (windowWidth >= props.breakpoints[currentBreakIndex + 1]) {
      props.currentBreakpoint = props.breakpoints[currentBreakIndex + 1];
      rebuildSlider();
    } else if (currentBreakIndex > 0 && windowWidth < props.breakpoints[currentBreakIndex]) {
      props.currentBreakpoint = props.breakpoints[currentBreakIndex - 1];
      rebuildSlider();
    }

    return;
  };

  /**
   * Disables and resets current slide and dot indices back
   * to the beginning and runs most of the init functions
   * except for the parsing options function
   * @return {Slipnslider}
   */
  var rebuildSlider = function rebuildSlider() {
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
  };

  /**
   * Sets the width of the slider stage as well as
   * the contained slides
   * @return {SlipnSlider}
   */
  var defineSizes = function defineSizes() {
    removeStageTransition();
    var totalPadding = (props.total - 1) * props.slidePadding;
    props.slideWidth = Math.ceil((props.slider.offsetWidth - props.slidePadding * (props.slidesPerPage - 1)) / props.slidesPerPage);
    var stageWidth = props.total * props.slideWidth + totalPadding;
    props.stage.style.width = stageWidth + 'px';
    props.dragThreshold = props.slider.offsetWidth / 4;
    props.slideBy = props.slideWidth + props.slidePadding;

    // TODO: check if props.total is the same as props.slides.length
    for (var i = 0, j = props.slides.length; i < j; i++) {
      props.slides[i].style.width = props.slideWidth + 'px';
      props.slides[i].style.marginLeft = props.slidePadding + 'px';
    }

    navigateToSlide();
    addStageTransition();
    return;
  };

  /**
   * Navigates the slider to an adjacent slide. Wraps
   * to opposite end if slider is not in infinite mode
   * and default behaviour is to increment or decrement
   * based on value of direction.
   * @param  {Boolean} direction True navigates forward and False navigates backwards
   * @param  {Event Obj} e       Optional event data
   * @return {SlipnSlider}
   */
  var determineAction = function determineAction(direction, e) {
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
  };

  /**
   * Action to execute when left and right arrows are
   * pressed for navigation.
   * @param  {Event Obj} e Event data for the keydown event
   * @return {SlipnSlider}
   */
  var onKeyDown = function onKeyDown(e) {
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
  };

  /**
   * Finds the slide to navigate to corresponding to the
   * index number of the clicked dot. Sets the activeSlideIndex
   * to the target slide index.
   * @param  {Event Obj} e Event click data
   * @return {SlipnSlider}
   */
  var onDotClick = function onDotClick(e) {
    e.preventDefault();
    if (props.isTransitioning) {
      return;
    }

    var dotIndex = Array.prototype.indexOf.call(props.navDots, e.currentTarget);

    if (dotIndex === props.activeDotIndex) {
      return;
    }

    props.dotClickCallback(props.activeDotIndex, dotIndex);
    onTransitionStart();
    props.activeDotIndex = props.activeSlideIndex = dotIndex;

    if (props.isInfiniteOverride) {
      props.activeSlideIndex += props.slidesPerPage + 1;
    }

    navigateToSlide();

    return;
  };

  /**
   * Event listener for the start of dragging the slider. Stores the
   * current x coordinate and the y coordinate of device is a touch device
   * so that scrolling is still possible.
   * @param  {Event Obj} e Event touch/click data
   * @return {SlipnSlider}
   */
  var onDragStart = function onDragStart(e) {
    if (props.isTransitioning) {
      return;
    }

    removeStageTransition();
    props.isDragging = true;

    var eData = props.isAndroid ? e.touches[0] : e;

    if (props.isMobileDevice) {
      props.brokeHorizontalThreshold = false;
      props.curYPos = eData.pageY;
    }

    props.startpoint = eData.pageX;

    return;
  };

  /**
   * Handles moving the slider according to users movements
   * and scrolling if on a touch device. Prevents slider
   * from moving beyond the first and last slide if not
   * in infinite mode.
   * @param  {Event Obj} e Event Drag data
   * @return {SlipnSlider}
   */
  var onDrag = function onDrag(e) {
    if (props.isTransitioning || !props.isDragging) {
      return;
    }
    var eData = props.isAndroid ? e.changedTouches[0] : e;
    // flag for preventing default click event when slides are anchor tags
    props.wasDragged = true;

    if (props.isMobileDevice) {
      // Check to see if user is moving more vertically than horizontally
      // to then disable the drag
      var yMvt = Math.abs(props.curYPos - eData.pageY);
      var xMvt = Math.abs(props.startpoint - eData.pageX);
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

    var currentPos = (props.activeSlideIndex * props.slideWidth + props.slidePadding * props.activeSlideIndex) * -1;
    var movePos = currentPos - (props.startpoint - eData.pageX) * 0.7;

    if (!props.isInfiniteOverride) {
      // Dividing by 4 and multiplying by 0.75 allows a
      // peek over either end by a quarter of slide width
      if (movePos >= props.slider.offsetWidth / 4) {
        movePos = props.slider.offsetWidth / 4;
      } else if (movePos <= -props.stage.offsetWidth + props.slider.offsetWidth * 0.75) {
        movePos = -props.stage.offsetWidth + props.slider.offsetWidth * 0.75;
      }
    }

    props.stage.style[props.transformPrefix] = 'translate3d(' + movePos + 'px, 0, 0)';

    return;
  };

  /**
   * Reinstantiates the stage transition and determines
   * if and which slide to move to based on the ending
   * x coordinate and the startpoint
   * @param  {Event Obj} e Event data from touchup/mouseup
   * @return {SlipnSlider}
   */
  var offDrag = function offDrag(e) {
    if (!props.isDragging) {
      return;
    }
    // if (props.isAndroid) { e.preventDefault(); }
    props.isDragging = false;
    props.stage.style[props.transitionPrefix] = 'all .75s';
    var eData = props.isAndroid ? e.changedTouches[0] : e;
    var travelled = e !== undefined ? props.startpoint - eData.pageX : 0;

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
  };

  /**
   * Sets isTransitioning flag to true to disable
   * user interaction
   * @return {SlipnSlider}
   */
  var onTransitionStart = function onTransitionStart() {
    props.isTransitioning = true;
    return;
  };

  /**
   * Listener for resetting the isTransitioning
   * flag to false after slider is finished making
   * its' way to the target slide
   * @return {SlipnSlider}
   */
  var onTransitionEnd = function onTransitionEnd() {
    props.isTransitioning = false;
    if (props.isInfiniteOverride) {
      checkForSlideSwap();
    }

    return;
  };

  /**
   * Binds the transition end event to the stage and executes an
   * optional callback function
   * @param  {Function} callback Optional callback to execute on transition completion
   * @return {SlipnSlider}
   */
  var bindTransitionEvents = function bindTransitionEvents(callback) {
    if (props.transitionEndPrefix) {
      props.stage.addEventListener(props.transitionEndPrefix, function (event, callback) {
        if (callback) {
          callback();
        }
        onTransitionEnd();
      }, false);
    }

    return;
  };

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
  var navigateToSlide = function navigateToSlide() {
    var moveTo = props.activeSlideIndex * props.slideBy;

    props.stage.style[props.transformPrefix] = 'translate3d(-' + moveTo + 'px,0,0)';
    if (props.hasDotNavOverride) {
      props.activeDot.className = '';
      props.activeDot = props.navDots[props.activeDotIndex];
      props.activeDot.className = props.dotIsActive;
    }

    return;
  };

  /**
   * Called on isInfinite mode to see if current
   * slide is a cloned one. If so, switches to its
   * uncloned brother
   * @return {SlipnSlider}
   */
  var checkForSlideSwap = function checkForSlideSwap() {
    if (props.activeDotIndex > 0 && props.activeSlideIndex <= props.slidesPerPage) {
      swapSlides(true);
    } else if (props.activeDotIndex === 0 && props.activeSlideIndex >= props.total - props.slidesPerPage - 1) {
      swapSlides(false);
    }
    return;
  };

  /**
   * Handles the actual switcharoo of between a cloned
   * slide and its brother by updated the activeSlideIndex,
   * removes the transition time, navigates to the new slide,
   * and restores transition time.
   * @param  {Boolean} direction True navigates to last uncloned slide, false to first uncloned slide
   * @return {SlipnSlider}
   */
  var swapSlides = function swapSlides(direction) {
    var slidesPerPageShift = props.slidesPerPage + 1;
    props.activeSlideIndex = direction ? props.total - slidesPerPageShift - 1 : slidesPerPageShift;
    removeStageTransition();
    navigateToSlide();
    addStageTransition();

    return;
  };

  /**
   * Use for getting dotsContainer and navContainer
   * @param  {DOM Element or string} el default value is slider, but can be a
   *                                 DOM node or string to run querySelector by
   * @return {Object}    DOM node
   */
  var findElement = function findElement(el) {
    var targetElement = void 0;
    if (props.slider === el) {
      targetElement = el;
    } else {
      targetElement = el.classList ? el : document.querySelector(el);
    }

    return targetElement;
  };

  /**
   * Sets the stage transition to 0 seconds
   * @return {SlipnSlider}
   */
  var removeStageTransition = function removeStageTransition() {
    props.stage.style[props.transitionPrefix] = 'all 0s';
    return;
  };

  /**
   * Sets stage transition to default value after 1ms
   * timeout so that there is a delay when chaining
   * @return {SlipnSlider}
   */
  var addStageTransition = function addStageTransition() {
    setTimeout(function () {
      props.stage.style[props.transitionPrefix] = 'all .75s';
    }, 1);
    return;
  };

  /**
   * Checks to see if slider is in the first position
   * @return {Boolean} returns true is at first position
   */
  var atFirstSlide = function atFirstSlide() {
    return props.activeDotIndex === 0 ? true : false;
  };

  /**
   * Checks to see if slider is in the last position
   * @return {Boolean} returns true if at last position
   */
  var atLastSlide = function atLastSlide() {
    return props.activeDotIndex === props.dotsCount - 1 ? true : false;
  };

  /**
   * Loops through the prefixes for transitionend to grab
   * the correct prefix for the current browser. From Modernizr
   * @return {String} transitionend prefix for current browser
   */
  var transitionEndEvent = function transitionEndEvent() {
    var t = void 0;
    var el = document.createElement('fakeelement');
    var transitions = {
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
  };

  /**
   * Retrieves the correct transition prefix with what
   * exists in the users browser
   * @return {String} Transition Prefix
   */
  var transitionPrefix = function transitionPrefix() {
    var t = void 0;
    var el = document.createElement('fakeelement');
    var transitions = {
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
  };

  /**
   * Retrieves the correct transform prefix
   * with what exists in the users browser
   * @return {String} Transform Prefix
   */
  var transformPrefix = function transformPrefix() {
    var t = void 0;
    var el = document.createElement('fakeelement');
    var transforms = {
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
  };

  var determineBrowserEvents = function determineBrowserEvents() {
    var start = void 0,
        end = void 0,
        move = void 0;
    if ('ontouchstart' in window) {
      start = 'touchstart';
      end = 'touchend';
      move = 'touchmove';
      props.isMobileDevice = true;
      if (navigator.userAgent.match(/Android/i)) {
        props.isAndroid = true;
      }
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
  };

  var getTransitionPrefixes = function getTransitionPrefixes() {
    props.transitionEndPrefix = transitionEndEvent();
    props.transitionPrefix = transitionPrefix();
    props.transformPrefix = transformPrefix();
    return;
  };

  var onNextClickHandler = determineAction.bind(null, true);
  var onPrevClickHandler = determineAction.bind(null, false);

  // =========================================================
  // Initialization function
  // =========================================================
  return {
    /**
     * Initialization function for setting up
     * and enabling the slider
     * @return {SlipnSlider}
     */
    init: function init() {
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
    disable: disable(true),
    lightDisable: disable(false)
  };
};

module.exports = SlipnSlider;

})));

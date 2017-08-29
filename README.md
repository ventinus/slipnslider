# SlipnSlider

## Another Slider?

Sure is. While there are many slider plugins available with a multitude of configurable options, they still seem to have restrictions with having dependencies and even performance issues. Highlights of this slider:

- All vanilla Javascript (written in ES6 and compiled to ES5 with Babel)
- Many configurable options (with more to come!) without over-bloating the code
- All options are definable within responsive breakpoints
- Extremely fast initialization, tear down, and re-initialization process (unnoticeable)



## Current options include (with defaults):

1. isInfinite: false
- Determines whether slider appears to be infinite with no end in either direction

2. hasDotNav: true
- Handles display property of the dots for showing relevant

3. hasControls: true
- Handles whether the prev and next buttons get created and appended

4. navContainer: '.slipnslider'
- Element for appending the prev and next buttons to

5. dotsContainer: '.slipnslider'
- Element for appending the dots to

6. navText: ['prev', 'next']
- Text/HTML to have rendered inside of the prev and next button tags

7. slideElement: 'div'
- Which element tag to have as your slide

8. stageElement: 'div'
- Which element tag to have as the stage/slides-wrapper

9. slidePadding: 10
- Space between the slides (measured in pixels)

10. slidesPerPage: 1
- How many full slides desired to have in view at a single time

11. prevNavigationCallback: function(direction) { console.log('prev callback', direction); }
- Callback to hook into the previous navigation function

12. nextNavigationCallback: function(direction) { console.log('next callback', direction); }
- Callback to hook into the next navigation function

13. dotClickCallback: function(prevIndex, nextIndex) { console.log('dot click callback', prevIndex, nextIndex); }
- Callback to hook into clicking a dot

14. responsive: {}
- Allows for customizeable options at certain window widths. Define a key that is the window width min, and the value is an object with any of the key value options defined above. For Example:


```
responsive: {
  0: {
    slidesPerPage: 1,
    isInfinite: false
  },
  420: {
    slidesPerPage: 2,
    isInfinite: true
  }
}
```

## A note on project structure...

- HTML
⋅⋅- Assemble/Handlebars for templating
- CSS
⋅⋅- Scss
⋅⋅- PostCSS Autoprefixer
- Javascript
⋅⋅- RequireJS
⋅⋅- Babel (ES6 Transpiling)
- Bower
- Grunt


## Setup

1. Clone/download repo
2. Run `cp build-env.js-dist build-env.js` to make a local copy of the build environment variables
3. Run `npm install -g grunt-cli`
4. Run `npm install`
5. Run `bower install`
6. Run `grunt`
7. Run `grunt connect`
8. Navigate to `localhost:4000` in browser to view output
9. Optionally run `grunt watch` to watch for changes


## Production Builds
Want to build for production? Run `grunt --prod` and the following will occur:
- CSS will be minified
- JS will run through the r.js optimizer and be minified into one `main.js` file.
- `foot.hbs` markup will output adjust ouput for production.

Need to check for production in your Handlebars templates? Simply use an `{{#if production}}` block to output content for production.


## Errors or want more features?

Submit an issue or pull request.

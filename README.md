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

## Errors or want more features?

Submit an issue or pull request.

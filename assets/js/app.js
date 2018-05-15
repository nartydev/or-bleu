
  TweenMax.set(".centered, nav", {autoAlpha: 1, xPercent:-50, yPercent:-50, force3D:true}); 


  //Forked from [Chrysto](http://codepen.io/bassta/)'s Pen [Fullscreen slides with TweenLite, CSSPlugin and ScrollToPlugin](http://codepen.io/bassta/pen/kDvmC/).  Optimized with the help of Blake Owen

  //First the variables our app is going to use need to be declared

  //References to DOM elements
  var $window = $(window);
  var $document = $(document);
  //Only links that starts with #
  var $navButtons = $("nav a").filter("[href^=#]");
  var $navGoPrev = $(".go-prev");
  var $navGoNext = $(".go-next");
  var $slidesContainer = $(".slides-container");
  var $allSlides = $(".slide");
  var $currentSlide = $allSlides.first();
  var slideControl = $("nav a")


  //Animating flag - is our app animating
  var isAnimating = false;

  //The height of the window
  var pageHeight = $window.innerHeight();

  //Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
  var keyCodes = {
    UP  : 38,
    DOWN: 40
  };


  var currentIndex = 0;
  
  var timeline1 = new TimelineLite()

    .reverse();
    
    
  var timeline2 = new TimelineLite()
    .to("#hand01", 0.5,{autoAlpha:1, repeat:3}, "+=0.5")  
    .to("#mund01", 0.5,{morphSVG:"#mund02"}, "+=0")
    .to("#kopf, #mund01", 1, {autoAlpha: 0}, "+=1")
    .to("#kopf02, #mund03", 1, {autoAlpha: 1}, "-=1")
    .to("#text", 1, {autoAlpha: 1}, "-=0.5")
    .to("#kamera", 1, {rotation:-20, transformOrigin:"50% 50%"}, "-=0.5")
    .to('.againPIN', 0.5, {autoAlpha: 1},"+=1")    
    .reverse();

    $(".againPIN").on("click", function() {
        timeline2.restart();
    }); 
    
  
  var timeline3 = new TimelineLite({repeat:-1, yoyo: true,  repeatDelay:0.5})
    .to("#ME",2, {morphSVG:"#ME02", repeat:3, yoyo: true,  repeatDelay:0.5})
    .fromTo("#YOU",2, {y:"+110%"}, {y:"0%", repeat:3, yoyo: true,  repeatDelay:0.5},0.2)
    .to('.againME', 0.5, {autoAlpha: 1},"+=1") 
    .reverse();
    
    $(".againME").on("click", function() {
        timeline3.restart();
    }); 

    
    var timeline4 = new TimelineLite()
    .set('.sonne', {autoAlpha: 1})
    .fromTo('.sonne', 4, {x:"-150%"}, {x:"+200%", scale: 0.4, ease: Power4.easeNone},0)
    .to('.sonne', 0.1, {autoAlpha: 0},"-=1")
    .to('#wolke', 4, {x:"+80%", ease: Power4.easeNone},"-=1")
    .to(".rohr01",0.07, {x:"-30px", repeat:9,  yoyo: true, repeatDelay:0.1, ease: Power4.easeIn},0.8)
    .to('.againGreenAttack', 0.5, {autoAlpha: 1},"+=1") 
    .reverse();

    $(".againGreenAttack").on("click", function() {
        timeline4.restart();
    }); 
    
  var timeline5 = new TimelineLite()
    .set('.rauch', { autoAlpha:1}, "+=1")
    .to('.rauch', 3, { y: "-100%", scale:1.8, opacity:0, repeat: 3, repeatDelay: 1})
    .to('.againHELMUT', 0.5, {autoAlpha: 1},"+=1")
    .reverse();

    $(".againHELMUT").on("click", function() {
        timeline5.restart();
    });  
    
  var timelines = [timeline1, timeline2, timeline3, timeline4, timeline5];
  
  //Going to the first slide
  goToSlide($currentSlide);
  //TweenLite.set($currentSlide, {className: "+=active"});

  /*
    *   Adding event listeners
    * */

    $window.on("resize", onResize).resize();
    $window.on("mousewheel DOMMouseScroll", onMouseWheel);
    $document.on("keydown", onKeyDown);
    $navButtons.on("click", onNavButtonClick);
    $navGoPrev.on("click", goToPrevSlide);
    $navGoNext.on("click", goToNextSlide);
    
  
  /*
    *   Internal functions
    * */


  /*
    *   When a button is clicked - first get the button href, and then slide to the container, if there's such a container
    * */
  function onNavButtonClick(event)
  {
    //The clicked button
    var $button = $(this);

    //The slide the button points to
    var $slide = $($button.attr("href"));

    //If the slide exists, we go to it
    if($slide.length)
    {
      goToSlide($slide);
      event.preventDefault();
    }
  }

  /*
    *   Getting the pressed key. Only if it's up or down arrow, we go to prev or next slide and prevent default behaviour
    *   This way, if there's text input, the user is still able to fill it
    * */
  function onKeyDown(event)
  {

    var PRESSED_KEY = event.keyCode;

    if(PRESSED_KEY == keyCodes.UP)
    {
      goToPrevSlide();
      event.preventDefault();
    }
    else if(PRESSED_KEY == keyCodes.DOWN)
    {
      goToNextSlide();
      event.preventDefault();
    }

  }

  /*
    *   When user scrolls with the mouse, we have to change slides
    * */
  function onMouseWheel(event)
  {
    //Normalize event wheel delta
    var delta = event.originalEvent.wheelDelta / 30 || -event.originalEvent.detail;

    //If the user scrolled up, it goes to previous slide, otherwise - to next slide
    if(delta < -1)
    {
      goToNextSlide();
    }
    else if(delta > 1)
    {
      goToPrevSlide();
    }

    event.preventDefault();


  }

  /*
    *   If there's a previous slide, slide to it
    * */
  function goToPrevSlide()
  {
    if($currentSlide.prev().length)
    {
      goToSlide($currentSlide.prev());
    }
  }

  /*
    *   If there's a next slide, slide to it
    * */
  function goToNextSlide()
  {
    if($currentSlide.next().length)
    {
      goToSlide($currentSlide.next());
    }
  }


  /*
    *   Actual transition between slides
    * */
  function goToSlide($slide)
  {
    //If the slides are not changing and there's such a slide
    if(!isAnimating && $slide.length)
    {
      //setting animating flag to true
      isAnimating = true;
      $currentSlide = $slide;
      NextSlide = $currentSlide.next()           

      //Sliding to current slide
      TweenLite.to($slidesContainer, 1, {scrollTo: {y: pageHeight * $currentSlide.index() }, onComplete: onSlideChangeEnd, onCompleteScope: this});

      //Definig slide status
      TweenLite.to($allSlides.filter(".active"), 0.1, {className: "-=active"});
      TweenLite.to($allSlides.filter($currentSlide), 0.1, {className: "+=active"});

      //Animating menu items
      TweenLite.to($navButtons.filter(".active"), 0.5, {className: "-=active"});
      TweenLite.to($navButtons.filter("[href=#" + $currentSlide.attr("id") + "]"), 0.5, {className: "+=active"});


    }
  }

  /*
    *   Once the sliding is finished, we need to restore "isAnimating" flag.
    *   You can also do other things in this function, such as changing page title
    * */
  function onSlideChangeEnd() {
    isAnimating = false;
    
    // Reverse the timeline for the previous slide
    timelines[currentIndex].reversed(true).progress(0);
    
    // Change the index
    currentIndex = $currentSlide.index();
    
    // Play the timeline for the current slide
    timelines[currentIndex].reversed(false);
  }

  /*
    *   When user resize it's browser we need to know the new height, so we can properly align the current slide
    * */
  function onResize(event)
  {

    //This will give us the new height of the window
    var newPageHeight = $window.innerHeight();

    /*
        *   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
        * */
    if(pageHeight !== newPageHeight)
    {
      pageHeight = newPageHeight;

      //This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
      TweenLite.set([$slidesContainer, $allSlides], {height: pageHeight + "px"});

      //The current slide should be always on the top
      TweenLite.set($slidesContainer, {scrollTo: {y: pageHeight * $currentSlide.index() }});
    }

  }
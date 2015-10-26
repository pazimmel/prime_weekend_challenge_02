//make a carousel out the incoming data
    //store incoming data to a variable
//link ids
var zetaGitInfo = [];
var indexTracker = 0;
var countdown, interval; //variables for timer
var carouselFade;

interval = 10;
timerMessage = " seconds left";
carouselFade = 1000;


$(document).ready(function(){
    //get zeta info with from server, path "/data"
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(dat){
            //store data into variable zetaGitInfo
            zetaGitInfo = dat.zeta;
            //console.log(zetaGitInfo);
            //create carousel
            createCarousel(zetaGitInfo);
        }
    });

    //click listeners to move the carousel
    $('#gitCarousel').on('click', '#prev', prevSlide);
    $('#gitCarousel').on('click', '#next', nextSlide);

});

//create carousel for zeta info
function createCarousel(array) {

    //create carousel container
    $("#gitCarousel").append("<div class='main-carousel container'></div>");
    var $el = $("#gitCarousel").children().last();

    $el.append("<div class = 'person container col-md-8'></div>");
    //$("#gitCarousel").children().last().prepend("<div class = 'person container col-mod-6'></div>");
    //call functions to create carousel
    createNavButtons();
    createIndexPoints();
    updateIndexPoint();
    updateInfo();
    carouselTimer(interval, timerMessage);


    //function create index points to cycle through
    function createIndexPoints(){
        $el.append("<div class ='index-box col-md-6 col-md-offset-3'></div>") //box for all the index points
        for (var i =0;i<array.length; i++){
            $el.children().last().append("<div class='index-point' id = 'index" + i +"'></div>");
            //div class = 'index-point' id ='index0' for i = 0 is one of the divs
        }
    }
    //function to create nav buttons
    function createNavButtons() {
        $el.prepend("<div id='prev' class ='nav-button container col-md-2' aria-label = 'Left'>" +
            "<span class = 'glyphicon glyphicon-chevron-left' aria-hidden ='true'></span></div>");
        $el.append("<div id = 'next' class ='nav-button container col-md-2 aria-label = 'Right'>" +
            "<span class = 'glyphicon glyphicon-chevron-right' aria-hidden ='true'></span></div>");
    }

}

//function to update index point of carousel
function updateIndexPoint(){
    for (i = 0; i<zetaGitInfo.length;i++){
        $("#index"+i).removeClass("index-point-active");

        if(i == indexTracker){
            $("#index"+i).addClass("index-point-active");
        }
    }
}

//function to move carousel to the right
function nextSlide(){
    stopCarouselTimer();
    indexTracker++;
    if (indexTracker >= zetaGitInfo.length){
        indexTracker = 0;
    }
    updateInfo();
    updateIndexPoint();
    carouselTimer(interval, timerMessage);

}

//function to move carousel to the left
function prevSlide(){
    stopCarouselTimer();
    indexTracker--;
    if (indexTracker < 0){
        indexTracker = zetaGitInfo.length-1;
    }
    updateInfo();
    updateIndexPoint();
    carouselTimer(interval,timerMessage);
}

//function to display git info on the carousel.
function updateInfo() {
    $(".person").empty();

    infoDiv(zetaGitInfo[indexTracker]);

    //make a div out of each property in the object and put it on the DOM inside the person class
    function infoDiv(object){

        //following commented code was used to do the same thing earlier. Think present code is cleaner.
        //$(".person").remove();
        //$("#gitCarousel").children().last().prepend("<div class = 'person container col-mod-6'></div>");
        //var $displayPerson = $("#gitCarousel").children().children().first();

        for (prop in object) {

            //$displayPerson.append("<div class = '"+prop+"'>"+object[prop]+"</div>");

            $("#gitCarousel").find(".person").append("<div class = '"+prop+"'>"+object[prop]+"</div>");
        }

    }

    //hide and show person with fade. Have to hide the children so that the container size doesn't change
    $("#gitCarousel").find(".person").children().hide();
    $("#gitCarousel").find(".person").children().fadeIn(carouselFade);

}
//timer functions for the carousel
//function startCarouselTimer(){
//    intervalID = setInterval(nextSlide, interval);
//}
function stopCarouselTimer(){
    clearInterval(countdown);
}

//$.fn.countdown = function (callback, duration, message) {
function carouselTimer(duration, message){
    $(".carousel-timer").remove();
    // If no message is provided, we use an empty string
    message = message || "";
    // Get reference to container, and set initial content
    var $timerContainer = $("#gitCarousel").children().last();
    $timerContainer.append("<div class = 'carousel-timer'>"+duration+message+"</div>");
    // Get reference to the interval doing the countdown
    countdown = setInterval(function () {
        // If seconds remain
        if (--duration) {
            // Update our container's message
            $(".carousel-timer").remove();
            $timerContainer.append("<div class = 'carousel-timer'>"+duration+message+"</div>");
            // Otherwise
        } else {
            // Clear the countdown interval
            clearInterval(countdown);
            nextSlide();
        }
        // Run interval every 1000ms (1 second)
    }, 1000);

};
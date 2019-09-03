$(document).ready(function(){
    //init ScroolMagic
    var controller = new ScrollMagic.Controller();

    //build a scene
    var ourScene01 = new ScrollMagic.Scene({
        triggerElement: '#animation01'
    })
    .setClassToggle('#animation01', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);

    var ourScene02 = new ScrollMagic.Scene({
        triggerElement: '#animation02'
    })
    .setClassToggle('#animation02', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);

    var ourScene03 = new ScrollMagic.Scene({
        triggerElement: '#animation03'
    })
    .setClassToggle('#animation03', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);

    var ourScene04 = new ScrollMagic.Scene({
        triggerElement: '#animation04'
    })
    .setClassToggle('#animation04', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);

    
    var ourScene04 = new ScrollMagic.Scene({
        triggerElement: '#animation05'
    })
    .setClassToggle('#animation05', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);

    
    var ourScene04 = new ScrollMagic.Scene({
        triggerElement: '#animation06'
    })
    .setClassToggle('#animation06', 'fade-in') //add class project01
    //.addIndicators() // this is require plugin
    .addTo(controller);
});
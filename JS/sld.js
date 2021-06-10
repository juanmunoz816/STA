const slider = document.querySelector("#sldr");
let sliderSection = document.querySelectorAll(".sld_sec");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn_r");
const btnRight = document.querySelector("#btn_l");

slider.insertAdjacentElement("afterbegin", sliderSectionLast);

function Next() {
    let sliderSectionFirst = document.querySelectorAll(".sld_sec")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement("beforeend", sliderSectionFirst);
        slider.style.marginLeft = "-100%";
    }, 500);
}

function Prev() {
    let sliderSection = document.querySelectorAll(".sld_sec");
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement("afterbegin", sliderSectionLast);
        slider.style.marginLeft = "-100%";
    }, 500);
}

btnRight.addEventListener('click', function(){
    Next();
});

btnLeft.addEventListener('click', function(){
    Prev();
});


setInterval(function(){
    Next();
}, 5000);

/* ______________________________________________ */

const slider2 = document.querySelector("#sldr2");
let sliderSection2 = document.querySelectorAll(".sld_sec2");
let sliderSectionLast2 = sliderSection2[sliderSection2.length -1];

const btnLeft2 = document.querySelector("#btn_r2");
const btnRight2 = document.querySelector("#btn_l2");

slider2.insertAdjacentElement("afterbegin", sliderSectionLast2);

function Next2() {
    let sliderSectionFirst2 = document.querySelectorAll(".sld_sec2")[0];
    slider2.style.marginLeft = "-200%";
    slider2.style.transition = "all 0.5s";
    setTimeout(function(){
        slider2.style.transition = "none";
        slider2.insertAdjacentElement("beforeend", sliderSectionFirst2);
        slider2.style.marginLeft = "-100%";
    }, 500);
}

function Prev2() {
    let sliderSection2 = document.querySelectorAll(".sld_sec2");
    let sliderSectionLast2 = sliderSection2[sliderSection2.length -1];
    slider2.style.marginLeft = "0";
    slider2.style.transition = "all 0.5s";
    setTimeout(function(){
        slider2.style.transition = "none";
        slider2.insertAdjacentElement("afterbegin", sliderSectionLast2);
        slider2.style.marginLeft = "-100%";
    }, 500);
}

btnRight2.addEventListener('click', function(){
    Next2();
});

btnLeft2.addEventListener('click', function(){
    Prev2();
});

setInterval(function(){
    Next2();
}, 5000);
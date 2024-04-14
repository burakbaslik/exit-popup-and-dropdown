/*  
    Exit popup and earpiece
    It can be used in counted and count-free versions.
    After the popup is displayed once, the earpiece appears on the next page view.
    If the coupon is copied in the popup, the popup is removed after 2 seconds.
    The count-free setup operates indefinitely.
    config.time is only the countdown minute for the counted setup.
*/ 

const config = {
    desktopWidth: "600px",
    mobileWidth: "320px",
    popupimg: "https://r.resimlink.com/eQlTnzAo.png",
    dropDownImg: "https://r.resimlink.com/pys6_g4.png",
    url: "#",
    //time: Time for the counter
    time: 12,
    //targetName: Check to see if popup appears
    targetName: "exit-popup",
    couponcode: "XYZ",
    //before ve after buttonText:  The text to be written before and after pressing the button
    beforebuttonText: "Copy",
    afterbuttonText: "Copied",
    //countdownControl: Check whether a meter is required
    countdownControl: true,
};

function FirePopup() {
    if (!document.querySelector("#popup-container")) {
        //Keeps this LocalStorage popup showing 
        localStorage.setItem(config.targetName, true);
        var style = document.createElement("style");
        style.innerHTML = `
        #popup-container {
            z-index: 10000;
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
        }
        .popup-overlay {
            z-index: 10000;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.6;
            position: fixed;
            top: 0;
            left: 0;
        }
        .popup {
            position: absolute;
            z-index: 100001;
            width:${config.desktopWidth};
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
        }
        .popup-image {
            width:${config.desktopWidth};
        }
        .popup-close {
            position: absolute;
            right: 1em;
            top: 1em;
            cursor: pointer;
            z-index: 2;
            width: 2em;
            height: 2em;
            background-color: white;
            color: black;
            display: grid;
            place-items: center;
            border-radius: 50%;
        }
        .popup-countdown{
            display: flex;
            color: #424242;
            position: relative;
            top: 12px;
            left: 7px;
        }
        #popup-counter{
            position: absolute;
            top: 157px;
            left: 244px;
            font-size: 40px;
        }
        #minute{
            margin-right: 7px;
        }
        .coupon-popup{
            position: absolute;
            font-size: 20px;
            left: 185px;
            display: flex;
            border-radius: 12px;
            background-color: #424242;
            color: white;
            height: 44px;
        }
        .coupon-popup-text{
            position: relative;
            left: 8px;
            top: -11px;
        }
        #popup-copied-button{
            left: 14px;
            margin-right: 17px;
            margin-top: 4px;
            border: solid 3px;
            border-radius: 10px;
            height: 35px;
            font-weight: bold;
            background: white;
            color: #424242;
            position: relative;
            cursor: pointer;
        }
        @media only screen and (max-width: 768px) {
            .popup {
                width:${config.mobileWidth};
            }
            .popup-image {
                width:${config.mobileWidth};
            }
            .coupon-popup {
                font-size: 12px;
                left: 194px;
                flex-direction: column;
            }
            .coupon-popup-text {
                left: 6px;
                top: 6px;
            }
            #popup-copied-button {
                margin-right: 2px;
                margin-top: 0px;
                height: 23px;
            }  
            .coupon-text{
                width: 95px;
                height: 16px;
                position: relative;
                left: 7px;
                top: 4px;
            }
            #minute {
                margin-right: 7px;
                font-size: 17px;
            }
            #second {
                font-size: 17px;
            }
            .popup-countdown {
                top: 3.2px;
                left: 8px;
            }
            #popup-counter{
                left: 212px;
                height: 25px;
                width: 73px;
                top: 134px;
                display: block;
                border-radius: 8px;
                font-size: 15px;
            }
        }
        }
        `;
        document.head.append(style);

        const popup = document.createElement("div");
        popup.id = "popup-container";
        popup.innerHTML = `
        <div class="popup-overlay"></div>
        <div class="popup">
        <div class="coupon-popup">
        <p class="coupon-popup-text">Coupon Code: ${config.couponcode}</p>
        <button type="button" id="popup-copied-button">${config.beforebuttonText}</button>
        </div>
          <span class="popup-close">&#x2716;</span>
          <a href=${config.url}>
            <img src=${config.popupimg} class="popup-image" alt="popup-image" />
          </a>
          <div id="popup-counter">
            <div class="popup-countdown">
                <div id="minute">00</div>
                <div id="second">00</div>
            </div>
            </div>
        </div>        
        `;
        document.body.append(popup);

        //Changes to popup when there is no counter
        if(!config.countdownControl){
            document.querySelector("#popup-counter").style.display = "none";
            if(window.innerWidth < 768){
                document.querySelector(".coupon-popup").style.left = "193px";
                document.querySelector(".popup-countdown").style.left = "2px";
            }
        }
        document.querySelector(".coupon-popup").style.top = config.countdownControl ? (window.innerWidth > 768 ? "327px" : "162px") : (window.innerWidth > 768 ? "275px": "155px");
        var copiedTextPopup = document.querySelector("#popup-copied-button");

        couponCode(copiedTextPopup);
        //The following code makes the popup close when the popup close key or something other than the popup is pressed
        popup.querySelector(".popup-overlay").addEventListener("click", closePopup);
        popup.querySelector(".popup-close").addEventListener("click", closePopup);

        function closePopup() {
            popup.remove();
            style.remove();
            fireDropDown();
        }
    }
}

//Allows the Popup to open with the exit tendency
var exitCheck = false;
if (window.innerWidth > 768) {
    document.addEventListener(
        "mouseleave",
        function (e) {
            if (e.clientY < 0 && exitCheck == false) {
                exitCheck = true;
                if(!localStorage.getItem(config.targetName)){
                   FirePopup(); 
                }
                
                if((localStorage.getItem("counter") === null) && config.countdownControl){
                    openCounter();
                }
            }
        },
        false
    );
} else {
    var lastScrollTop = 0;
    var checkScrollSpeed = (function (settings) {
        settings = settings || {};
        var lastPos,
            newPos,
            timer,
            delta,
            delay = settings.delay || 50;
        function clear() {
            lastPos = null;
            delta = 0;
        }
        clear();

        return function () {
            newPos = window.scrollY;
            if (lastPos != null) {
                delta = newPos - lastPos;
            }
            lastPos = newPos;
            clearTimeout(timer);
            timer = setTimeout(clear, delay);
            return delta;
        };
    })();
    window.addEventListener(
        "scroll",
        function () {
            var st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
            } else {
                if (checkScrollSpeed() <= -80) {
                    if (!exitCheck) {
                        exitCheck = true;
                        if(!localStorage.getItem(config.targetName)){
                            FirePopup(); 
                        }
                        if((localStorage.getItem("counter") === null) && config.countdownControl){ 
                            openCounter();
                        }           
                    }
                }
            }
            lastScrollTop = st <= 0 ? 0 : st;
        },
        false
    );
}

//Counter creation function
function openCounter(){
    var sayac = setInterval(function(){
        var second = 1000;
        var minute = second*60;
        var now = new Date().getTime();
        var gap = localStorage.getItem("counter")-now;
        let m = Math.floor(gap/minute);
        let s = Math.floor((gap % minute)/second);
        document.querySelector("#minute").innerHTML = m>9 ? `${m} : ` : `0${m} : `;
        document.querySelector("#second").innerHTML = s>9 ? `${s}` : `0${s}`; 
        
        //Edits are deleted when seconds becomes a negative number
        if(s<0){
            localStorage.removeItem("counter");
            if(document.querySelector("#popup-container")){
                document.querySelector("#popup-container").remove();
                localStorage.removeItem(config.targetName);

            }
            if(document.querySelector("#k-main-container")){
                document.querySelector("#k-main-container").remove();
                localStorage.removeItem(config.targetName);
            }
            clearInterval(sayac);
        }
        },1000);

        //Counter control in LocalStorage
        if(localStorage.getItem("counter") === null && config.countdownControl){
        localStorage.setItem("counter", new Date().getTime() + (config.time*1000*60));
    }
}

//Auricle creation Function
function fireDropDown(){
const styleDropDown = document.createElement("style");
styleDropDown.innerHTML = `
    #k-main-container{
        display: flex;
        position: fixed;
        top: 50%;
        right: 0px;
        z-index: 100000;
    }
    #k-main-counter{
        width: 200px;
        height: 300px;
        border: solid 1px;
    }
    #k-arrow-button{
        position: relative;
        top: 139px;
        background: #424242;
        color: white;
        width: 45px;
        padding-top: 1.18px;
        padding-bottom: 11px;
        height: 35px;
        font-size: 30px;
        text-align: center;
        font-family: system-ui;
        cursor:pointer;
        border-radius: 9px 0px 0px 9px;
    }
    .k-counter{
        display: flex;
        position: absolute;
        top: 125px;
        color: #424242;
        right: 65px;
    }
    #second{
        font-size: 30px;
        position: relative;
        top: 8px;
        left: 7px;
    }
    #minute{
        font-size: 30px;
        position: relative;
        top: 8px;
        margin-right: 9px;
        left: 7px;
    }
    .k-coupon{
        font-size: 14px;
        left: 80px;
        display: block;
        background-color: #424242;
        color: white;
        border-radius: 20px;
    }
    .k-coupon-text{
        position: relative;
        left: 16.8px;
        top: 1px;
        padding: 3px;
    }
    .k-button{
        margin-left: 6px;
        border: solid 3px;
        border-radius: 10px;
        font-weight: bold;
        background: white;
        color: #424242;
        left: 50%;
        top: 50%;
        position: relative;
        transform: translate(-58%, -36%);
        cursor:pointer;
    }
    .k-main-coupon{
        position: relative;
        bottom: 79px;
        width: 149px;
        left: 28px;
    }

@media only screen and (max-width: 768px) {
    #second {
        font-size: 30px;
        top: 2px;
        left: 7px;
    }
    #minute {
        font-size: 30px;
        top: 2px;
        margin-right: 9px;
        left: 7px;
    }
    .k-counter {
        top: 201px;
        height: 35px;
        right: 45px;
        width: 105px;
    }
    .k-button{
        margin-top: 4px !important;
    }
    .k-coupon-text {
        left: 14.8px;
        top: -0.6px;
        padding: 4px;
    }
    #k-arrow-button {
        padding-top: 0px;
        padding-bottom: 2px;
    }
}
`;

const htmlDropDown = document.createElement("div");
htmlDropDown.innerHTML = `
<div id="k-main-container">
        <span id="k-arrow-button"></span>
        <div id="k-main-counter">
        <img src=${config.dropDownImg}>
        <div class="k-main-coupon">
        <div class="k-coupon">
        <p class="k-coupon-text">Coupon Code: ${config.couponcode}</p>
        </div>
        <button type="button" class="k-button">${config.beforebuttonText}</button>
        </div>
            <div class="k-counter">
                <div id="minute">00</div>
                <div id="second">00</div>
            </div>
            </div>
    </div>
`;

document.body.append(htmlDropDown);
document.head.append(styleDropDown);

var counterbox = document.querySelector(".k-counter");
var copiedTextDropDown = document.querySelector(".k-button");
let dropDownCoupon = document.querySelector(".k-main-coupon");
var arrowbutton = document.querySelector("#k-arrow-button");
var maincontainer = document.querySelector("#k-main-container");
//Below, the counter sends the button of the counter to the couponCode function so that integration can be done according to the earpiece.
couponCode(copiedTextDropDown); 

//Revision to be made on the auricle when there is no counter 
if(!config.countdownControl){
    counterbox.style.display = "none";
    dropDownCoupon.style.bottom = "82px";
}

//Arrow Button control
var temp = true;
arrowbutton.innerHTML = " >> ";
arrowbutton.addEventListener("click", function(){
    maincontainer.style.transition = "right 1s ease-in-out";
    if(!temp){
        maincontainer.style.right = "-202px";
        arrowbutton.innerHTML = " << ";
    }
    else{
        maincontainer.style.right = "0px";
        arrowbutton.innerHTML = " >> ";
    }
    temp = !temp;
});
}

//Copied coupon function
function couponCode(x){ 
    var temp = true;
    x.addEventListener("click",function(){
        if(temp){
            temp = !temp;
        }
        if (!navigator.clipboard) {
            var elem = document.createElement("textarea");
            document.body.appendChild(elem);
            elem.value = config.couponcode;
            elem.select();
            document.execCommand("copy");
            document.body.removeChild(elem);
        } else {
            navigator.clipboard.writeText(config.couponcode); 
        }
        x.innerHTML = config.afterbuttonText; 

        //Close the popup when the coupon is copied in the popup
        if(x == document.querySelector("#popup-copied-button")){
            setTimeout(() => {
               document.querySelector("#popup-container").remove();
               fireDropDown(); 
            }, 2000);
        }
    });
}

//To open the popup if the popup is shown
if(localStorage.getItem(config.targetName)){
    fireDropDown();
    if((localStorage.getItem("counter") != null) && config.countdownControl){
        openCounter();
    }  
}

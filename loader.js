_7vBookingRating=(function(params) {
    
if (document.documentElement.clientWidth<767) {return}

if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
    return
}
if (sessionStorage.getItem("7vBRClose")==1){
    return
}

const APIURL = 'https://reviews.tourhotel24.ru/api?type=rating&hotel=';
const iframeURL = 'w.html';
const paramsDefault={
    'id': null,
    'position': 'left bottom'
}

const widgetStyle = {
    'width': '150px',
    'min-height': '150px',
    'background': 'transparent',
    'border': 'none',
    'padding': '0',
    'margin': '0',
    'position': 'fixed',
    'z-index': '99999',
    'transition': 'all cubic-bezier(1, 0, 0.3, 0.99) 0.6s',
    'box-shadow': '0 1px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 12px 0 rgba(0, 37, 204, 0.16)',
    'border-radius': '7px',
    'transition-property': 'transform, opacity',
    'transition-timing-function': 'cubic-bezier(0.42, 0.03, 0, 1.09)',
    'transition-duration': '.5s'
    
}

const widgeteAttr = {
    'id': '_7vBookingRating',
    'scrolling': 'no',
    'className': '_7vBookingRating_closed',
    'src': 'about:blank'
}

let frame, widgete;

params = params || paramsDefault;
if (!params.id || !(!isNaN(parseFloat(params.id)) && isFinite(params.id))) {
    console.log('Не указан ID отеля!');
return
}

/* Получает данные по отелю через API */
fetch(APIURL + params.id, {})
    .then(function (response) {
        let contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        //throw new TypeError("Oops, we haven't got JSON!");
    })
    .then(function (data) {
        if (data.error==null && data.data!=null){

            createWidgete(params);
            setTimeout(() => {
                
                renderWidgete(data.data);
                setEvents();
                showWidgete();
            }, 100);

        }
    })
    .catch(function (error) {
        console.log(error);
    });





/**
    * Создает виджет
    * @param  {obj} 
    * @return {HTML Iframe}.
*/

function createWidgete(params) {

    let animationStyle, animation;
    const widgetStylePosition={};
    const style = document.createElement('style');
    style.type = 'text/css';
    
    widgete = document.createElement('iframe');
    Object.assign(widgete, widgeteAttr);
    Object.assign(widgete.style, widgetStyle);


    switch (params.position) {
        case 'left top':
        case 'top left':
            widgetStylePosition.left = '10px';
            widgetStylePosition.top = '90px';
            animation = 'translateX(-150%)'; 
            break;

        case 'left center':
        case 'center left':
            widgetStylePosition.left = '10px';
            widgetStylePosition.top = '50%';
            widgetStylePosition.marginTop = '-75px';
            animation = 'translateX(-150%)'; 
            break;

        case 'left bottom':
        case 'bottom left':
            widgetStylePosition.left = '10px';
            widgetStylePosition.bottom = '90px';
            animation = 'translateX(-150%)'; 
            break;

        case 'center bottom':
        case 'bottom center':
            widgetStylePosition.left = '50%';
            widgetStylePosition.marginLeft = '-75px';
            widgetStylePosition.bottom = '10px';  
            animation ='translateY(150%)';          
            break;

        case 'right top':
        case 'top right':
            widgetStylePosition.right = '10px';
            widgetStylePosition.top = '90px';
            animation = 'translateX(150%)'; 
            break;

        case 'right center':
        case 'center right':
            widgetStylePosition.right = '10px';
            widgetStylePosition.top = '50%';
            widgetStylePosition.marginTop = '-75px';
            animation = 'translateX(150%)'; 
            break;

        case 'right bottom':
        case 'bottom right':
            widgetStylePosition.right = '10px';
            widgetStylePosition.bottom = '90px';
            animation = 'translateX(150%)'; 
            break;

        default:
            widgetStylePosition.left = '10px';
            widgetStylePosition.bottom = '90px';
            animation = 'translateX(-150%)'; 
            break;
    }


    animationStyle = `
        ._7vBookingRating {  transform: translateX(0) translateY(0) ; opacity: 1}
        ._7vBookingRating_closed {  transition-timing-function: cubic-bezier(1, -0.09, 0.7, 0.97);  transition-duration: 1s; opacity: 0; transform: ${animation};  } 
        @media screen and (max-width:767px){#_7vBookingRating {display:none}}
    `;

    style.innerHTML = animationStyle;
    document.getElementsByTagName('head')[0].appendChild(style);


    Object.assign(widgete.style, widgetStylePosition);
    document.body.appendChild(widgete);

}


function renderWidgete(data) {

    const template=`
   
<style>
    * {
        box-sizing: border-box;
    }
    body {
        margin:0;
        padding: 0;
    }
    #_7vBookingRating {
        width: 150px;
        min-height: 150px;
        background: #012983;
        background: radial-gradient(ellipse at center, #012983 0%, #001c58 100%);
        text-align:center;
        padding: 7px 20px 10px 20px;
        font-size:12px;
        font: normal normal 13px/1   'Open Sans',Ubuntu, Verdana, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color:#fff;
        -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
        position: relative;

    }

    #_7vBookingRating__label {
        color: #efc13d;
    }

    #_7vBookingRating__rating {
        background-color: #e4af1d;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        color: #fff;
        font-size:28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;

    }

    #_7vBookingRating__booking {
        color: #fff;
        font-size:14px;
        font-weight: 700;
        width: 78px;
    }
    #_7vBookingRating__close {
        position: absolute;
        top:3px;
        right: 3px;
        width: 20px;
        cursor:pointer;
        fill:#fff;
        opacity: 0.7;
    }
    #_7vBookingRating__close:hover {
        cursor: pointer;
        opacity: 1;
    }
    #_7vBookingRating__close svg {
        width: 100%;
    }

#_7vBookingRating__rating{
  animation: animationFrames linear 10s 2;
  /* animation-iteration-count: 1; */
  /* transform-origin: 50% 50%; */
  animation-delay: 5s;
}

@keyframes animationFrames{
  0% {
    transform:  rotate(0deg);
  }
  1% {
    transform:  rotate(-10deg);
  }
  3% {
    transform:  rotate(10deg);
  }
  4.5% {
   transform:  rotate(-10deg);
  }
  6% {
    transform:  rotate(10deg);
  }
  7.5% {
    transform:  rotate(-10deg);
  }
  9% {
    transform:  rotate(0deg);
  }
  100% {
    transform:  rotate(0deg);
  }  

}

</style>

    
<div id="_7vBookingRating">
    <div id="_7vBookingRating__label">Guest review</div>
     <div id="_7vBookingRating__name">${data.hotelName}</div>
    <div id="_7vBookingRating__rating">
        <div id="_7vBookingRating__value">${data.totalScore.toString().replace('.', ',')}</div>
    </div>
    <div id="_7vBookingRating__booking">
        <svg viewBox="0 0 62.81 10.49" xmlns="http://www.w3.org/2000/svg">
        <path transform="translate(-652.26 -379.98)" d="M676.9,380.94a1,1,0,1,1,1,1,1,1,0,0,1-1-1" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M692,387.33a1,1,0,1,1,1,1,1,1,0,0,1-1-1" fill="#e4af1d"/>
        <path transform="translate(-652.26 -379.98)" d="m661.23 386.92a1.6 1.6 0 1 1 1.4 -1.59 1.44 1.44 0 0 1 -1.4 1.59zm0-4.58a3 3 0 1 0 3 3 2.9 2.9 0 0 0 -3 -3" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M675,385.47a1.43,1.43,0,0,0-.23-.32l-.05-.06.06-.05a2.39,2.39,0,0,0,.24-.3l1.53-2.29h-1.86l-1.15,1.79a.45.45,0,0,1-.39.14h-.26V381c0-.68-.42-.77-.87-.77h-.78v8h1.65v-2.4h.15c.19,0,.32,0,.38.12l.91,1.73a.92.92,0,0,0,1,.55h1.27l-.94-1.57-.62-1.19" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M683.06,382.32a2.24,2.24,0,0,0-1.68.69l-.1.1,0-.14a.76.76,0,0,0-.83-.53h-.74v5.78h1.64v-2.66a2.16,2.16,0,0,1,.1-.69,1.35,1.35,0,0,1,1.33-1c.51,0,.71.27.71,1v2.52a.76.76,0,0,0,.87.88h.78v-3.67c0-1.46-.71-2.23-2.05-2.23" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M677.87,382.45h-.78v4.47h0v1.31h1.63v-4.9a.76.76,0,0,0-.86-.88" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="m667.67 386.92a1.6 1.6 0 1 1 1.4 -1.59 1.44 1.44 0 0 1 -1.4 1.59zm0-4.58a3 3 0 1 0 3 3 2.9 2.9 0 0 0 -3 -3" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="m702.82 386.92a1.6 1.6 0 1 1 1.4 -1.59 1.44 1.44 0 0 1 -1.4 1.59zm0-4.58a3 3 0 1 0 3 3 2.9 2.9 0 0 0 -3 -3" fill="#e4af1d"/>
        <path transform="translate(-652.26 -379.98)" d="M688.57,386.66c-.9,0-1.22-.79-1.22-1.52,0-.32.08-1.38,1.13-1.38.52,0,1.21.15,1.21,1.44S689.09,386.66,688.57,386.66Zm2-4.23a.71.71,0,0,0-.67.35l0,.09-.08-.07a2.23,2.23,0,0,0-1.51-.5,2.59,2.59,0,0,0-2.57,2.88,2.65,2.65,0,0,0,2.6,2.92,2,2,0,0,0,1.26-.37l.13-.1v.16c0,.77-.5,1.2-1.4,1.2a3.3,3.3,0,0,1-1.1-.2.49.49,0,0,0-.69.33l-.13.32-.18.47.11.06a4.46,4.46,0,0,0,2,.49,2.73,2.73,0,0,0,3-2.74v-5.3h-.76" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M655.12,386.85h-1.33v-1.6c0-.34.13-.52.42-.56h.91a1.08,1.08,0,0,1,0,2.17Zm-1.33-4.32v-.42c0-.37.16-.54.5-.57H655a.86.86,0,0,1,.94.94.89.89,0,0,1-.92,1h-1.2v-.92Zm3,1.6-.24-.14.21-.18a1.94,1.94,0,0,0,.66-1.51c0-1.26-1-2.07-2.47-2.07h-1.91a.84.84,0,0,0-.81.83v7.13H655c1.67,0,2.75-.91,2.75-2.33a2,2,0,0,0-.93-1.74" fill="#fff"/>
        <path transform="translate(-652.26 -379.98)" d="M713.16,382.34a2.26,2.26,0,0,0-1.76.86l-.12.15-.09-.17a1.63,1.63,0,0,0-1.55-.84,2.08,2.08,0,0,0-1.51.68l-.16.17-.06-.22a.73.73,0,0,0-.8-.5h-.69v5.75H708v-2.54a2.84,2.84,0,0,1,.08-.67c.15-.61.56-1.27,1.25-1.21.43,0,.63.37.63,1v3.41h1.58v-2.54a2.32,2.32,0,0,1,.09-.69,1.36,1.36,0,0,1,1.22-1.19c.48,0,.66.27.66,1v2.57c0,.58.26.84.84.84h.74v-3.67c0-1.47-.64-2.21-1.91-2.21" fill="#e4af1d"/>
        <path transform="translate(-652.26 -379.98)" d="M698.91,386.22a2.42,2.42,0,0,1-1.57.72,1.53,1.53,0,0,1-1.63-1.61,1.52,1.52,0,0,1,1.54-1.63c.29,0,.63.11.68.28v0a.58.58,0,0,0,.56.43h.86v-.75c0-1-1.26-1.35-2.11-1.35a3,3,0,1,0,0,6,3.24,3.24,0,0,0,2.41-1l0-.06-.68-1.13-.09.1" fill="#e4af1d"/>
        </svg>

    </div>

    <div id="_7vBookingRating__close">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM17,8.25,13.25,12,17,15.75,15.75,17,12,13.25,8.25,17,7,15.75,10.75,12,7,8.25,8.25,7,12,10.75,15.75,7Z"></path>
        </svg>
    </div>
</div>

`
    _7vBookingRating
    frame = getFrameDocument(document.getElementById(widgeteAttr.id));
    frame.getElementsByTagName('body')[0].innerHTML = template;
}


function setEvents() {
    frame.getElementById('_7vBookingRating__close').addEventListener('click', function () {
        closeWidgete();
    })
}

function getFrameDocument(frame) {
    return frame && (frame.contentDocument || frame.contentWindow || null);
}




function showWidgete(){
    setTimeout(() => {
        widgete.classList.remove("_7vBookingRating_closed");
        widgete.classList.add("_7vBookingRating");
    }, 10);
}

function closeWidgete(){
    widgete.classList.add("_7vBookingRating_closed");
    sessionStorage.setItem('7vBRClose', 1);
}


    return {
        //showWidgete: showWidgete,
        closeWidgete: closeWidgete
    }

})(_7vBR);


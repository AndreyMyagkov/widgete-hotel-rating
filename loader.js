_7vBookingRating=(function(params) {
    
if (document.documentElement.clientWidth<767) {return}

if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
    return
}
if (sessionStorage.getItem("7vBRClose") == 1){
    return
}

const APIURL = 'https://reviews.tourhotel24.ru/api?type=rating&hotel=';

const paramsDefault={
    'id': null,
    'position': 'left bottom',
    'mode': 'tripadvisor',  // all | booking
    'nocopy': false
}

const widgetStyle = {
    'width': '150px',
    'min-height': '170px',
    'background': 'transparent',
    'border': 'none',
    'padding': '0',
    'margin': '0',
    'position': 'fixed',
    'z-index': '99999',
    'transition': 'all cubic-bezier(1, 0, 0.3, 0.99) 0.6s',
    //'box-shadow': '0 1px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 12px 0 rgba(0, 37, 204, 0.16)',
    //'border-radius': '7px',
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

let isBooking = false;
let isTrip = false;

let frame, widgete;

params = params || paramsDefault;
if (!params.id || !(!isNaN(parseFloat(params.id)) && isFinite(params.id))) {
    console.log('Не указан ID отеля!');
    return
}

    if (!params.mode ) {
        params.mode = 'all'
    }
    if (['all', 'booking', 'tripadvisor'].indexOf(params.mode) == -1 ) {
        params.mode = 'all'
    }



/* Получает данные по отелю через API */
    fetch(APIURL + params.id + `&mode=${params.mode}`, {})
    .then(function (response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

    })
    .then(data => {
        if (data.error == null && data.data != null){
            let bookingTemplate = '', tripTemplate = '';


            data.data.animated = '';

            if (data.data.totalScore) {
                isBooking = true;
                bookingTemplate = renderTemplateBooking(data.data);
            }
            if (data.data.tripadvisor) {
                if (data.data.tripadvisor.totalScore) {
                    isTrip = true;

                    data.data.tripadvisor.totalScore10 = data.data.tripadvisor.totalScore * 10;
                    data.data.tripadvisor.totalScore = data.data.tripadvisor.totalScore.toString().replace('.', ',').padEnd(3,',0');

                    data.data.tripadvisor.allReviews = data.data.tripadvisor.allReviews ? data.data.tripadvisor.allReviews : 0;
                    data.data.tripadvisor.reviewsLabel = declensions(data.data.tripadvisor.allReviews, ['отзыва', 'отзывов', 'отзывов']);
                    
                    if (isBooking && isTrip) {
                        data.data.animated = 'animated'
                    }
                    
                    tripTemplate = renderTemplateTrip(data.data);
                    //console.log(data.data.tripadvisor);
                }
            }



            if (isBooking || isTrip) {

                createWidgete(params);
                setTimeout(() => {
                    
                    renderWidgete(bookingTemplate, tripTemplate, params.nocopy);
                    showWidgete();
                    setEvents();
                }, 100);

            }

        }
    })
    .catch(error => {
        console.log(error);
    });


/**
 * Склонение числительных
 * @param {Number} number 
 * @param {Array} titles 
 */
function declensions(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}



/**
 * Создает фрейм виджета
 * @param  {obj} 
 * @return {HTML Iframe}.
*/

function createWidgete(params) {

    let animationStyle, animation;
    const widgetStylePosition={};
    const style = document.createElement('style');

    
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

    /**
     * Рендерит шаблон Букинга
     * @param {Object} data
     * @return {HTML} 
     */
    function renderTemplateBooking(data) {

        return `
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

            

        </div>    
    `;

    }

    /**
     * Рендерит шаблон Трип
     * @param {Object} data
     * @return {HTML}
     */
    function renderTemplateTrip(data) {

        return `
        <div id="_7vTripRating" class="${data.animated}">
            <div id="_7vTripRating__label">Рейтинг на</div>

            <div id="_7vTripRating__logo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 936 610">
                    <path fill="#FBC40E" stroke="#FBC40E" stroke-width="4.17"
                        d="M317 53.5c42-18 94-28 147-28 52 0 100 10 142 28-79 3-142 68-142 147 0-81-66-147-147-147z" />
                    <path fill="#E42127" d="M312 176.5c-13 0-24 11-24 24s11 24 24 24c14 0 24-11 24-24s-10-24-24-24z" />
                    <path fill="#199F46" d="M608 176.5c-13 0-24 10-24 24 0 13 11 24 24 24 14 0 24-11 24-24 0-14-10-24-24-24z" />
                    <path fill="#252523"
                        d="M316 129.5c-39 0-71 32-71 71 0 40 32 72 71 72s71-32 71-72c0-39-32-71-71-71zm0 121c-27 0-50-23-50-50s23-49 50-49 50 22 50 49-23 50-50 50zm445-195h-99c-50-33-118-55-197-55s-152 22-202 55h-94c16 18 27 42 30 59-18 24-28 54-28 86 0 82 65 148 147 148 46 0 87-22 114-55 11 13 29 39 33 46 0 0 21-31 33-46 27 33 68 55 114 55 81 0 147-66 147-148 0-32-10-62-28-86 3-17 14-41 30-59zm-443 264c-66 0-119-53-119-119 0-65 53-118 119-118 65 0 118 53 118 118 0 66-53 119-118 119zm0-266c42-18 94-28 147-28s100 10 143 28c-80 3-143 68-143 147 0-81-66-147-147-147zm294 266c-65 0-118-53-118-119 0-65 53-118 118-118 66 0 119 53 119 118 0 66-53 119-119 119zm0-191c-39 0-71 32-71 72 0 39 32 71 71 71s71-32 71-71c0-40-32-72-71-72zm0 121c-27 0-49-22-49-49 0-28 22-50 49-50s50 22 50 50c0 27-23 49-50 49z" />
                    <path fill="#2B2A29"
                        d="M794 79.5h-5v-19h7c3 0 8 0 8 5 0 3-1 5-4 5l4 9h-5l-4-8h-1v8zm0-11h3c2-1 2-2 2-3s0-2-1-2h-4v5z" />
                    <path fill="#2B2A29"
                        d="M797 52.5c-10 0-18 8-18 18s8 18 18 18 17-8 17-18-7-18-17-18zm0 32c-8 0-15-6-15-14s7-14 15-14 14 6 14 14-6 14-14 14z" />
                    <path fill="#199F46"
                        d="M916 487.5h-5v-20h7c3 0 8 0 8 6 0 2-1 4-4 5l4 9h-5l-4-8h-1v8zm0-11c2 0 3 0 3-1 2 0 2-1 2-2 0-2-1-2-1-3h-4v6z" />
                    <path fill="#199F46"
                        d="M919 460.5c-10 0-18 8-18 18 0 9 8 17 18 17 9 0 17-8 17-17 0-10-8-18-17-18zm0 32c-8 0-15-7-15-14 0-8 7-15 15-15s14 7 14 15c0 7-6 14-14 14z" />
                    <path fill="#2B2A29"
                        d="M62 484.5v-16H35v-25l-20 6v19H0v16h15v51c0 23 10 35 28 35 7 0 13-1 17-3h1l-1-16-1 1c-3 0-6 1-11 1-4 0-7-2-9-4-2-3-4-8-4-15v-50h27zM132 466.5c-3-1-4-1-6-1-6 0-12 2-17 6-4 4-8 8-10 14l-1-17H79c1 9 1 19 1 32v68h21v-53c0-10 2-17 7-22 5-6 10-8 17-8h6l1 1v-20zM150 568.5h21v-100h-21v100zM160 451.5c4 0 8-1 10-3 2-3 4-6 4-10 0-3-2-6-4-9-3-2-6-3-9-3-4 0-7 1-10 3-2 3-3 6-3 9 0 4 1 7 3 10 3 2 6 3 9 3zM271 479.5c-8-9-18-14-30-14-15 0-26 6-34 17l-1-15h-19v1c1 9 1 20 1 33v108h21v-52c3 4 6 7 11 9 5 3 11 5 18 5 13 0 24-5 32-15 9-10 13-23 13-40 0-15-4-27-12-37zm-50 8c4-3 9-4 14-4 8 0 15 3 20 9 5 7 7 15 7 25 0 11-2 20-7 26-5 7-12 10-21 10-7 0-13-2-18-8-5-5-7-11-7-19v-16c0-2 1-6 2-11 2-4 5-8 10-12z" />
                    <path fill="#199F46"
                        d="M376 567.5c-1-6-2-14-2-24v-36c0-13-3-24-10-31s-17-11-30-11-25 3-34 9l-1 1 5 14 1-1c8-5 17-7 26-7 8 0 13 2 17 5 4 4 5 10 5 16v1c-19 0-34 4-45 10-10 6-16 16-16 28 0 8 3 15 9 21 6 5 13 8 23 8 13 0 23-4 31-14l2 12h19v-1zm-29-19c-5 4-11 6-18 6-5 0-9-1-12-4-2-3-4-6-4-11 0-7 3-12 9-15 6-4 17-6 32-6v15c0 6-3 11-7 15zM480 568.5v-1c-1-6-1-15-1-26v-120h-20v56c-3-3-7-6-11-8-5-3-11-4-18-4-13 0-23 5-32 15s-13 23-13 39c0 15 4 27 12 37s19 15 31 15c8 0 15-2 21-6 4-3 8-6 11-11l1 14h19zm-21-59v16c0 8-3 15-8 20s-11 8-18 8c-8 0-15-3-20-10-5-6-7-15-7-25s3-19 8-26c5-6 11-10 20-10 6 0 12 3 17 8s8 11 8 19zM565 468.5s-26 52-28 58c-2-7-28-58-28-58h-22l50 100 50-100h-22zM597 468.5v100h20v-100h-20zM607 451.5c4 0 7-1 9-3 3-3 4-6 4-10 0-3-1-6-4-9-2-2-5-3-9-3s-7 1-9 3c-3 3-4 6-4 9 0 4 1 7 4 10 2 2 5 3 9 3zM699 521.5c-4-4-11-9-21-12-8-3-13-5-15-8-3-2-4-4-4-8 0-3 2-6 4-9 3-2 7-3 12-3 7 0 14 2 21 6l6-15h-1c-7-5-16-7-26-7s-19 3-26 9c-6 6-10 13-10 22 0 12 10 22 28 28 7 3 11 5 14 7 3 3 4 6 4 10s-2 7-5 10c-3 2-7 3-13 3-9 0-17-2-25-7h-1l-5 16h1c8 5 18 7 29 7 12 0 22-3 29-8 7-6 10-13 10-23 0-7-2-13-6-18zM800 480.5c-9-10-21-15-35-15s-26 5-35 15c-10 9-14 22-14 39 0 15 4 27 13 37 9 9 21 14 35 14 9 0 17-2 25-6 7-5 13-11 18-19 4-8 6-18 6-28 0-15-4-28-13-37zm-36 74c-8 0-15-3-20-10s-8-15-8-26 2-20 8-27c5-6 12-10 20-10 9 0 16 4 21 11s8 15 8 25c0 11-3 20-9 27-5 7-12 10-20 10zM882 466.5c-2-1-4-1-5-1-6 0-12 2-17 6s-8 8-11 14l-1-17h-18c1 9 1 19 1 32v68h20v-53c0-10 3-17 8-22 4-6 10-8 17-8h6l1 1v-20h-1z" />
                </svg>
            </div>

            <div id="_7vTripRating__rating">
                <div class="rating-tripadvisor__wrapper rating-tripadvisor__wrapper_${data.tripadvisor.totalScore10}">
                    <li class="rating-tripadvisor__item"> </li>
                    <li class="rating-tripadvisor__item"> </li>
                    <li class="rating-tripadvisor__item"> </li>
                    <li class="rating-tripadvisor__item"> </li>
                    <li class="rating-tripadvisor__item"> </li>
                </div>


                <div id="_7vTripRating__value">${data.tripadvisor.totalScore}</div>
            </div>

            <div id="_7vTripRating__reviews">на основании <br><b>${data.tripadvisor.allReviews} ${data.tripadvisor.reviewsLabel}</b></div>
            
        </div>    
    `;


    }

    function renderWidgete(booking, trip, nocopy) {
    const css = `
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
            border-radius: 8px;

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
            z-index: 10;
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


    #_7vTripRating.animated {
        opacity:0;
        position: absolute;
        animation: animationTrip linear 20s infinite;
        /* animation-iteration-count: 1; */
        /* transform-origin: 50% 50%; */
        animation-delay: 10s;
    }

    @keyframes animationTrip {
    0% {
        opacity:0%;
    }
    7% {
        opacity:100%;
    }
    50% {
        opacity:100%;
    }
    57% {
        opacity:0%;
    }  
    100% {
        opacity:0%;;
    }  

    }

    #_7vWidgeteWrapper {
        position: relative;
    }

    #_7vTripRating {
            z-index: 1;
            top: 0;
            left:0;
            background: #8EC560;
            width: 150px;
            min-height: 150px;
            text-align: center;
            padding: 7px 20px 10px 20px;
            font-size: 12px;
            font: normal normal 13px/1 'Open Sans',Ubuntu, Verdana, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            border-radius: 7px;
        }

        #_7vTripRating__label {
            font-size: 15px;
            margin-bottom: 8px;
        }

        #_7vTripRating__logo {
            margin-bottom: 8px;
        }
        #_7vTripRating__logo svg {
            width: 90px;
        }

        #_7vTripRating__rating {
            display: flex;
            margin-bottom: 5px;
        }
        #_7vTripRating__stars {
            flex: 0 0;
        }
        ._7vTripRating__star {

        }
        #_7vTripRating__value {
            flex: 0 0;
            margin-left: 5px;
            font-size: 14px;
        }

        #_7vTripRating__reviews {
            font-size: 12px;
            letter-spacing: 1px;
        }

        .rating-tripadvisor__wrapper {
            list-style: none;
            height: 14px;
            position: relative;
            white-space: nowrap;

        }


        .rating-tripadvisor__wrapper_05 .rating-tripadvisor__item:first-child {
            background-image: linear-gradient(90deg,#ffffff 0,#ffffff 50%,#8ec560 51%)
        }

        .rating-tripadvisor__wrapper_10 .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_15
        .rating-tripadvisor__item:first-child {
            background: #fff
        }

        .rating-tripadvisor__wrapper_15 .rating-tripadvisor__item:nth-child(2) {
            background-image: linear-gradient(90deg,#ffffff 0,#ffffff 50%,#8ec560 51%)
        }

        .rating-tripadvisor__wrapper_20 .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_20
        .rating-tripadvisor__item:nth-child(2),.rating-tripadvisor__wrapper_25
        .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_25 .rating-tripadvisor__item:nth-child(2) {
            background: #fff
        }

        .rating-tripadvisor__wrapper_25 .rating-tripadvisor__item:nth-child(3) {
            background-image: linear-gradient(90deg,#ffffff 0,#ffffff 50%,#8ec560 51%)
        }

        .rating-tripadvisor__wrapper_30 .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_30
        .rating-tripadvisor__item:nth-child(2),.rating-tripadvisor__wrapper_30
        .rating-tripadvisor__item:nth-child(3),.rating-tripadvisor__wrapper_35
        .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_35
        .rating-tripadvisor__item:nth-child(2),.rating-tripadvisor__wrapper_35 .rating-tripadvisor__item:nth-child(3) {
            background: #ffffff
        }

        .rating-tripadvisor__wrapper_35 .rating-tripadvisor__item:nth-child(4) {
            background-image: linear-gradient(90deg,#ffffff 0,#ffffff 50%,#8ec560 51%)
        }

        .rating-tripadvisor__wrapper_40 .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_40
        .rating-tripadvisor__item:nth-child(2),.rating-tripadvisor__wrapper_40
        .rating-tripadvisor__item:nth-child(3),.rating-tripadvisor__wrapper_40
        .rating-tripadvisor__item:nth-child(4),.rating-tripadvisor__wrapper_45
        .rating-tripadvisor__item:first-child,.rating-tripadvisor__wrapper_45
        .rating-tripadvisor__item:nth-child(2),.rating-tripadvisor__wrapper_45
        .rating-tripadvisor__item:nth-child(3),.rating-tripadvisor__wrapper_45 .rating-tripadvisor__item:nth-child(4) {
            background: #fff
        }

        .rating-tripadvisor__wrapper_45 .rating-tripadvisor__item:nth-child(5) {
            background-image: linear-gradient(90deg,#ffffff 0,#ffffff 50%,#8ec560 51%)
        }

        .rating-tripadvisor__wrapper_50 .rating-tripadvisor__item {
            background: #fff
        }

        .rating-tripadvisor__item {
            display: inline-block;
            width: 14px;
            height: 14px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid #fff;
            border-radius: 50%;
            box-shadow: inset 0 0 0 2px #8ec560
        }

        #_7vBookingRating__copy {
            margin-top:5px;
            color:#777;
            text-align: center;
            font: normal normal 12px/1 'Open Sans',Ubuntu, Verdana, Arial, sans-serif;
        }
        #_7vBookingRating__copy a {
            color:#777;
        }

    </style>

    `;

    const copyTpl = (nocopy) => {
        return (nocopy ? '' : '<div id="_7vBookingRating__copy">Виджет от <a href="http://saitotelya.ru/" target="_blank">saitotelya.ru</a></div>');
    }
    const template=`
        ${css}
        <div id="_7vWidgeteWrapper">

            <div id="_7vBookingRating__close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM17,8.25,13.25,12,17,15.75,15.75,17,12,13.25,8.25,17,7,15.75,10.75,12,7,8.25,8.25,7,12,10.75,15.75,7Z"></path>
                </svg>
            </div>

            ${booking}

            ${trip}

            ${copyTpl(nocopy)}

        </div>
        `
    //_7vBookingRating
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


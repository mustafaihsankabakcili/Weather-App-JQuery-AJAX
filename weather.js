const form = $('.top-banner form');

const formJS = $('.top-banner form')[0];
const formJQuery = $('.top-banner form').eq(0);
// const formJQuery2 = $('.top-banner form').first();

// const inputJS = $('.top-banner input')[0];
const inputJQuery = $('.top-banner input').eq(0);


const msg = $('.top-banner span').eq(0);
const list = $('.cities').eq(0);


//window.addEventListener('DOMContentLoaded'..);
$(document).ready(()=>{
    localStorage.setItem('apiKey', EncryptStringAES('18900ba341544f10d83f1c8555905924'))
})

//window.addEventListener('load'..) == window.onload
$(window).on('load', ()=>{
    console.log('window loaded');
})


formJQuery.on('submit', e => {
    e.preventDefault();
    getWeatherDataFromApi();
})

const getWeatherDataFromApi = () => {
    let apiKey = DecryptStringAES(localStorage.getItem('apiKey'));
    let inputValue = inputJQuery.val();
    let units = 'metric';
    let lang = 'tr'
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&&appid=${apiKey}&units=${units}&lang${lang}`;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: (response) =>{
            // Successfully Completed
            const {main, name, sys, weather} = response;

            // querySelector == find()
            const cityListItem = list.find('.city');

            // Array.from == get()
            const cityArray = cityListItem.get();

            if(cityArray.length > 0){
                const filteredArray = cityArray.filter(card => $(card).find('.city-name span').text() == name)
                if(filteredArray.length > 0){
                    msg.text('You already know the weather for this city!');
                    msg.css({'color':'yellow' , 'text-decoration':'underline'});
                    setTimeout(()=>{
                        msg.text('');
                    }, 5000)
                    // js focus() == jquery focus()
                    formJS.reset();
                    formJQuery.focus();
                    return;
                }
            }


            const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

            // Create li Element
            const createdLi = $(document.createElement('li'));
            createdLi.addClass('city');
            createdLi.html(`
            <h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`);
            list.prepend(createdLi);
            formJS.reset();
            inputJQuery.focus();
        },
        beforeSend: (request) =>{
            // Header Data for API
        },
        complete: () => {
            // AJAX Completed
        },
        error: (XMLHttpRequest) =>{
            console.log(XMLHttpRequest);
            msg.text(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText);
            msg.css({'color':'red' , 'text-decoration':'underline'});
            setTimeout(()=>{
                msg.text('');
            }, 5000)
            
        }
    })
}
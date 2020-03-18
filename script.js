'use strict';

const apikey = "&api_key=YQ4WJEnAhrKaYgEgDjlzHVXsueWGhjI2r51yurVV";
const url = "https://developer.nps.gov/api/v1/parks?";
// /parks?stateCode=NY,NJ&limit=10&api_key=YQ4WJEnAhrKaYgEgDjlzHVXsueWGhjI2r51yurVV
let states = "";
let resultno = 0;

function getParksInfo(states, resultno) {
    let fullurl = url + 'stateCode=' + states + '&limit=' + resultno + apikey;
    console.log(fullurl);

    fetch(fullurl)
        .then(response => response.json())
        .then(responseJson => renderresults(responseJson))
        .catch(error => alert(error));
}

function search() {
    $('#js-vacation-list-form').submit(function (event) {
        event.preventDefault();
        if ($('.js-state-entry').val() != "") {
            $('.js-vacation-list').html("<p>Searching...</p>");
            states = $('.js-state-entry').val();
            resultno = $('.js-results-no-entry').val();
            getParksInfo(states, resultno);
        }
        else {
            alert("State is required for the search");
        }
    });
}

function renderhtml(responseJson) {
    console.log("started rendering html");
    console.log(responseJson.data[0].addresses[0]);
    let htmlrender = "";

    if (parseInt(responseJson.limit) > parseInt(responseJson.total)) {
        resultno = parseInt(responseJson.total);
    }
    else {
        resultno = parseInt(responseJson.limit);
    }

    for (let i = 0; i < resultno; i++) {
        htmlrender += `<h3>${responseJson.data[i].fullName}, ${responseJson.data[i].states}</h3>`;
        htmlrender += `<p>${responseJson.data[i].description}</p>`;

        for (let j = 0; j < responseJson.data[i].addresses.length; j++) {
            if (responseJson.data[i].addresses[j].stateCode == responseJson.data[i].states) {
                htmlrender += `<p>${responseJson.data[i].addresses[j].line1}
                        ${responseJson.data[i].addresses[j].line2}
                        ${responseJson.data[i].addresses[j].line3}
                        ${responseJson.data[i].addresses[j].city}, ${responseJson.data[i].addresses[j].stateCode}, ${responseJson.data[i].addresses[j].postalCode}
                     </p>`;
            }
        }
        htmlrender += `<p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p><hr/>`;
    }

    return htmlrender;
}

function renderresults(responseJson) {
    if (responseJson.code === 404) {
        alert('No parks found. Please try again');
    }
    else {
        let html = renderhtml(responseJson);
        $('.js-vacation-list').html(html);
    }
}

function start() {
    console.log("application is live");
    search();
}

start();
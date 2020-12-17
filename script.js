const container = document.querySelector('.container');
const vacantSeats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const dateSelect = document.getElementById('date_picker');
const timeSelect = document.getElementById("time_picker");

let ticketPrice = +movieSelect.value;

// add possible days to dropdown for date picker
var date_picker = document.getElementById("date_picker");

localStorage.removeItem("selectedSeats");
localStorage.removeItem("selectedTime");
localStorage.removeItem("selectedDate");

// define 7 days to the future from now
var nextDays = [];
var today = new Date();

for (var i = 0; i < 7; i++) {
    var nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    nextDays.push(nextDay.toDateString());
}

console.log('xxdate: nextDays: ' + nextDays);

for (var i = 0; i < nextDays.length; i++) {
    var optn = nextDays[i];
    var el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    date_picker.appendChild(el);
}

// add possible times to dropdown for time picker
var time_picker = document.getElementById("time_picker");

var projectionTimes = [
    '8:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00'
];

for (var i = 0; i < projectionTimes.length; i++) {
    var optn = projectionTimes[i];
    var el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    time_picker.appendChild(el);
}

// initial population
setMovieData(movieSelect.selectedIndex, movieSelect.value)
populateUI();


// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}


// update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    // Copy selected seats into arr
    // Map throught array
    // return a new array indexes
    const seatsIndex = [...selectedSeats].map(seat => [...vacantSeats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Get data from localstorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem(seatStorageKey()));

    vacantSeats.forEach((seat) => {
        seat.classList.remove('selected');
    });

    if (selectedSeats !== null && selectedSeats.length > 0) {
        vacantSeats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}


// movie select event
movieSelect.addEventListener("change", e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
    populateUI();
});

timeSelect.addEventListener("change", e => {
    localStorage.setItem("selectedTime", e.target.value);
    populateUI();
});

dateSelect.addEventListener("change", e => {
    localStorage.setItem("selectedDate", e.target.value);
    populateUI();
});


//Seat click event
container.addEventListener('click', e => {
    // Don't select seats when date and time not selected
    if (localStorage.getItem("selectedDate") == null || localStorage.getItem("selectedTime") == null) {
        return;
    }

    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }

    localStorage.setItem(
        seatStorageKey(),
        localStorage.getItem("selectedSeats"));
});

function seatStorageKey() {
    return localStorage.getItem("selectedMovieIndex") + "-" +
        localStorage.getItem("selectedDate") + "-" +
        localStorage.getItem("selectedTime") + "-seats"
}


// Initial count and total
updateSelectedCount();

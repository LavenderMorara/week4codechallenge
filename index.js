document.addEventListener('DOMContentLoaded', () => {
    const filmList = document.getElementById('filmList');
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('availableTickets');
    const buyTicketButton = document.getElementById('buyTicket');
    let currentFilm;
    

    function fetchFilmDetails(id) {
        fetch(`http://localhost:3000/films/${id}`)
            .then(response => {return response.json()})
            .then(film => {
                currentFilm = film;
                displayFilmDetails(film);
                
            });
        }           
         function displayFilmDetails(film) {
        poster.src =film.poster;
        title.textContent = `${film.title}`;
        runtime.textContent = `${film.runtime} minutes`;
        showtime.textContent = `${film.showtime}`;
        const available = film.capacity - film.tickets_sold;
        availableTickets.textContent = available;
        if (available > 0) {
             buyTicketButton.textContent = "Buy Ticket";
             buyTicketButton.disabled = false;
        } else {
             buyTicketButton.textContent = "Sold Out";
             buyTicketButton.disabled = true;
        
        }
    }

        function fetchFilms() {
            fetch(`http://localhost:3000/films`)
                .then(response => response.json())
                .then(films=> displayFilmList(films));
        }      

    function displayFilmList(films) {
        filmList.innerHTML = '';
        films.forEach(film=> {
            const filmItem = document.createElement('li');
            filmItem.textContent = film.title;
            filmItem.classList.add('film', 'item');
            if (film.capacity - film.tickets_sold === 0) {
                filmList.classList.add('sold-out');
            }
            filmItem.onclick = () => fetchFilmDetails(film.id);
            filmList.appendChild(filmItem);
        });
    fetchFilmDetails(`${films.id}`); 
    } 
    
    buyTicketButton.addEventListener('click',()=>{
        if (currentFilm && currentFilm.tickets_sold < currentFilm.capacity) {
            currentFilm.tickets_sold += 1;
            alert("Your ticket purchase was successful");
            displayFilmDetails(currentFilm);
            fetch(`http://localhost:3000/films/${currentFilm.id}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold })
            
            }
        }
        fetchFilms();
})
})

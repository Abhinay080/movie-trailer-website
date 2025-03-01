const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const APIkey = "yourapikey";
const Trailerbox = document.getElementById('Trailer-container');

async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=yourapikey`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
    
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let i=0 ; i<movies.length;i++){
        let movieListItem =document.createElement('div');
       // console.log(movieListItem);
       movieListItem.dataset.id = movies[i].imdbID;
       movieListItem.classList.add('search-list-item');
       if(movies[i].Poster != "N/A"){
        moviePoster = movies[i].Poster;
       }
       else{
        moviePoster="image_not_found.png";
       }
       movieListItem.innerHTML = `
       <div class = "search-item-thumbnail">
           <img src = "${moviePoster}">
       </div>
       <div class = "search-item-info">
           <h3>${movies[i].Title}</h3>
           <p>${movies[i].Year}</p>
       </div>
       `;
       searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=4cb1a65b`);
            const movieDetails = await result.json();
            //console.log(movieDetails);
            const result1 = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${10}&q=${movieDetails.Title+'Movie Trailer'+movieDetails.Year}&key=${APIkey}`);
            const df = await result1.json();
            console.log(df.items[0].snippet.title);
            //console.log(movie.dataset.Title);
            const videoid = df.items[0].id.videoId;
            const videourl = `https://www.youtube.com/embed/${videoid}`;
            displayMovieDetails(movieDetails,videourl);
        });
    });
}

function displayMovieDetails(details,trailerurl){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
    Trailerbox.innerHTML=`
    <iframe src="${trailerurl}" frameborder=0 width=660 height=300 allowfullscreen></iframe>
    `;
}
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

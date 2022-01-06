import fetch from "node-fetch";


var spotifyToken = ''
const tmToken = '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'
var countryCode = 'DE'


var client_id = '9f5344d0b735484b803e2515e98d68bc';
var client_secret = 'f20f8ac67914469295c296aa9fc6b224';

async function getToken() {
  
  

  const response = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/x-www-form-urlencoded',
    'Authorization' : 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}


async function getArtistsGenres(_token) {

  const response = await fetch(`https://api.spotify.com/v1/search?q=Metallica&type=artist&limit=1`, {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + _token}
  });

    const data = await response.json();
    return data.artists.items[0].genres;
}


async function getGenres(_token) {

  const response = await fetch(`https://app.ticketmaster.com/discovery/v2/classifications/segments/KZFzniwnSyZfZ7v7nJ?apikey=${_token}&locale=*`);

  const data = await response.json();
  return data._embedded.genres;
}


function getGenreID(_artistsGenres, _tmGenres) {
  var foundSubGenre = new Array;
  var foundGenre = new Array;

  _artistsGenres.forEach(i => {
    var genre = _tmGenres.find(element => element.name.toLowerCase() === i);
    
    if(genre == undefined){
      _tmGenres.forEach(j => {
        
        var subGenre = j._embedded.subgenres.find(element => element.name.toLowerCase() === i);

          if (subGenre != undefined) {
            foundSubGenre.push(subGenre.id);
          }
      });
    }
    
    if(genre != undefined) {
      foundGenre.push(genre.id);
    }
  });
  
  var genreIds = {
    genres : foundGenre,
    subGenres : foundSubGenre
  }

  return genreIds;
}



async function eventSearch(genreIds, _token) {
  const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=${_token}&locale=*&countryCode=${countryCode}&subGenreId=${genreIds.subGenres}`);

  const data = await response.json();
  return data;
}





spotifyToken = await getToken();
var artistsGenres = await getArtistsGenres(spotifyToken);
var tmGenres = await getGenres(tmToken);
var genreIds = getGenreID(artistsGenres, tmGenres);
var events = await eventSearch(genreIds, tmToken);
console.log(events);

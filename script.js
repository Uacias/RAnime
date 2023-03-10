const inputSearch = document.querySelector(`.search--input`);
const buttonSearch = document.querySelector(`.search--button`);
const containerFetched = document.querySelector(`.fetched`);
const containerAdded = document.querySelector(`.added`);

const popupOverlay = document.querySelector(`.overlay`);
const popup = document.querySelector(`.popup`);
const popupButton = document.querySelector(`.popup--button`);
const popupInput = document.querySelector(`.popup--input`);

let searchData = [];
let animeList = [];
let dataLocalStorage = [];
let receivedAnimeList = [];
let inputRank = 0;

const fetchAnime = (query) => {
  fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((anime) => {
        anime.userRating = 0;
        searchData.push(anime);
      });
      console.log(searchData);
      displayResults();
    });
  searchData = [];
};

const truncate = (str, n) => {
  return str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
};

const createCard = (anime) => {
  return `
     <div class="card" id="${anime.mal_id}">
      <img src="${
        anime.images.jpg.image_url
      }" alt="Anime" class="anime-picture" />
      <p class="anime-title">${truncate(anime.title, 40)}</p>
      <div class="container--rating">
        <div class="container--wrapper">
          <span class="increment">ᗑ</span>
          <span class="decrement">ᗐ</span>
          <span class="rate">${anime.userRating}</span>
        </div>
      </div>
      <button class="anime-btn-add">Add</button>
    </div>
  `;
};

const displayResults = () => {
  let html = '<div class="wrapper"><h2>Found</h2></div>';
  searchData.forEach((anime) => {
    html += createCard(anime);
  });
  containerFetched.innerHTML = html;
  hideRanks();
  setupAddButtons();
  setupRankingButtons();
  //TODO: SEARCHDATA IS BEING CLEANED - THAT CAUSES PROBLEM
  // searchData = [];
};

const hideRanks = () => {
  const fetchedCards = containerFetched.querySelectorAll(`.card`);
  fetchedCards.forEach((element) => {
    const rankDiv = element.querySelector(`.container--rating`);
    if (rankDiv) {
      rankDiv.style.display = `none`;
    }
  });
};

const search = () => {
  containerFetched.innerHTML = ``;
  if (inputSearch.value !== ``) {
    containerFetched.innerHTML += `<div class="wrapper">
    <h2> Found </h2> 
    </div>`;
    fetchAnime(inputSearch.value);
  } else {
    containerFetched.innerHTML += `<div class="wrapper">
    <h2> No results, try again! </h2> 
    </div>`;
  }
};

const setupRankingButtons = () => {
  const buttonsInc = document.querySelectorAll(`.increment`);
  const buttonsDec = document.querySelectorAll(`.decrement`);

  buttonsInc.forEach((btn) => {
    const card = btn.parentNode.parentNode.parentNode;
    const _rate = btn.parentNode.querySelector(`.rate`);
    btn.addEventListener(`click`, () => {
      if (_rate.innerHTML < 10) {
        _rate.innerHTML = +_rate.innerHTML + 0.5;
        const cardId = card.id;
        const anime = animeList.find((a) => a.mal_id == cardId);
        anime.userRating = +_rate.innerHTML;
        localStorage.setItem(`animeList`, JSON.stringify(animeList));
      }
    });
  });

  buttonsDec.forEach((btn) => {
    const card = btn.parentNode.parentNode.parentNode;
    const _rate = btn.parentNode.querySelector(`.rate`);
    btn.addEventListener(`click`, () => {
      if (+_rate.innerHTML > 0) {
        _rate.innerHTML = +_rate.innerHTML - 0.5;
        const cardId = card.id;
        const anime = animeList.find((a) => a.mal_id == cardId);
        anime.userRating = +_rate.innerHTML;
        localStorage.setItem(`animeList`, JSON.stringify(animeList));
      }
    });
  });
};

const setupAddButtons = () => {
  const buttons = document.querySelectorAll(`.anime-btn-add`);
  buttons.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const card = btn.parentNode;
      const cardId = card.id;
      const clickedObject = searchData.find((anime) => {
        return +anime.mal_id === +cardId;
      });

      if (btn.textContent === `Remove`) {
        const index = animeList.findIndex(
          (object) => +object.mal_id === +cardId
        );
        animeList.splice(index, 1);
        localStorage.setItem(`animeList`, JSON.stringify(animeList));
        containerAdded.removeChild(card);
      } else {
        animeList.push(clickedObject);
        console.log(clickedObject.userRating);
        localStorage.setItem(`animeList`, JSON.stringify(animeList));
        const rank = btn.parentNode.querySelector(`.container--rating`);
        rank.style.display = `block`;
        btn.textContent = `Remove`;
        containerAdded.appendChild(card);
      }
    });
  });
};

const createRemoveCard = (anime) => {
  let title = truncate(anime.title, 40);
  return `
     <div class="card" id="${anime.mal_id}">
      <img src="${anime.images.jpg.image_url}" alt="Anime" class="anime-picture" />
      <p class="anime-title">${title}</p>
      <div class="container--rating">
      <div class="container--wrapper">
        <span class="increment">ᗑ</span>
        <span class="decrement">ᗐ</span>
        <span class="rate">${anime.userRating}</span>
        </div>
      </div>
      <button class="anime-btn-remove">Remove</button>
    </div>
  `;
};

const setupRemoveButtons = () => {
  const buttons = document.querySelectorAll(`.anime-btn-remove`);
  buttons.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const card = btn.parentNode;
      const cardId = card.id;
      const clickedObject = searchData.find((anime) => {
        return +anime.mal_id === +cardId;
      });
      const index = animeList.findIndex((object) => +object.mal_id === +cardId);
      animeList.splice(index, 1);
      localStorage.setItem(`animeList`, JSON.stringify(animeList));
      containerAdded.removeChild(card);
    });
  });
};

inputSearch.addEventListener(`keydown`, (e) => {
  if (e.key == `Enter`) {
    e.preventDefault();
    search();
  }
});

buttonSearch.addEventListener(`click`, (e) => {
  e.preventDefault();
  search();
});

buttonSearch.addEventListener(`keydown`, (e) => {
  if (e.key == `Enter`) {
    e.preventDefault();
    search();
  }
});

const init = () => {
  if (localStorage.getItem(`animeList`) !== null) {
    dataLocalStorage = JSON.parse(localStorage.getItem(`animeList`));
    animeList = dataLocalStorage;
    let html = '<div class="wrapper"><h2>My ranking</h2></div>';
    dataLocalStorage.forEach((anime) => {
      html += createRemoveCard(anime);
    });
    containerAdded.innerHTML = html;
    setupRemoveButtons();
    setupRankingButtons();
  }
};

init();

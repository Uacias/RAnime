const inputSearch = document.querySelector(`.search--input`);
const buttonSearch = document.querySelector(`.search--button`);
const containerFetched = document.querySelector(`.fetched`);
const containerAdded = document.querySelector(`.added`);

const popupOverlay = document.querySelector(`.overlay`);
const popup = document.querySelector(`.popup`);
const popupButton = document.querySelector(`.popup--button`);
const popupInput = document.querySelector(`.popup--input`);

let searchData = [];
let myAnimeList = [];
let inputRank = 0;

const fetchAnime = (query) => {
  fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((anime) => {
        searchData.push(anime);
      });
      console.log(searchData);
      displayResults();
    });
};

const truncate = (str, n) => {
  return str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
};

const displayResults = () => {
  let title;
  searchData.forEach((anime) => {
    title = truncate(anime.title, 40);
    containerFetched.style.padding = `1rem`;
    containerFetched.innerHTML += `
        <div class="card">
          <img src="${anime.images.jpg.image_url}" alt="Anime" class="anime-picture" />
          <p class="anime-title">${title}</p>
          <div class="container--rating">
          <div class="container--wrapper">
            <span class="increment">ᗑ</span>
            <span class="decrement">ᗐ</span>
            <span class="rate">0</span>
            </div>
          </div>
          <button class="anime-btn-add">Add</button>
        </div>
        `;
  });

  hideRanks();
  setupAddButtons();
  setupRankingButtons();
  searchData = [];
};

const hideRanks = () => {
  const allCards = containerFetched.querySelectorAll(`.card`);
  allCards.forEach((element) => {
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

const setupRankingButtons = () => {
  const buttonsInc = document.querySelectorAll(`.increment`);
  const buttonsDec = document.querySelectorAll(`.decrement`);

  buttonsInc.forEach((btn) => {
    const card = btn.parentNode;
    const _rate = card.querySelector(`.rate`);
    btn.addEventListener(`click`, () => {
      if (_rate.innerHTML < 10) {
        _rate.innerHTML = +_rate.innerHTML + 0.5;
      }
    });
  });

  buttonsDec.forEach((btn) => {
    const card = btn.parentNode;
    const _rate = card.querySelector(`.rate`);
    btn.addEventListener(`click`, () => {
      if (+_rate.innerHTML > 0) {
        _rate.innerHTML = +_rate.innerHTML - 0.5;
      }
    });
  });
};

const setupAddButtons = () => {
  const buttons = document.querySelectorAll(`.anime-btn-add`);
  buttons.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const card = btn.parentNode;
      if (btn.textContent === `Remove`) {
        containerAdded.removeChild(card);
      } else {
        const rank = btn.parentNode.querySelector(`.container--rating`);
        rank.style.display = `block`;
        btn.textContent = `Remove`;
        containerAdded.appendChild(card);
      }
    });
  });
};

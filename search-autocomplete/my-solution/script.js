// SET UP

const searchInput = document.querySelector(".search-input");
const results = document.querySelector(".results");

// INPUT HANDLING

function debounce(callback, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

function handleInput() {
  const currentInput = searchInput.value;
  memoizedFetchMovies(currentInput);
}

searchInput.addEventListener("input", debounce(handleInput, 500));

// DATA FETCHING

function fetchMovies(query) {
  if (query) {
    searchData(query)
      .then((res) => {
        if (res.length) {
          const movies = res;
          cache[query] = movies;
          appendResults(movies, query);
        } else {
          console.log("No movies found with that title");
          deleteOldList();
        }
      })
      .catch((err) => console.log(err));
  } else deleteOldList();
}

// MEMOIZATION

let cache = {};
function memoizedFetchMovies(query) {
  if (query in cache) {
    appendResults(cache[query], query);
  } else {
    fetchMovies(query);
  }
}

// APPEND RESULTS

function deleteOldList() {
  while (results.firstChild) {
    results.removeChild(results.lastChild);
  }
}

function appendResults(arr, query) {
  deleteOldList();
  const highlightedHtmlMovies = arr.map((movie) => {
    return highlightQuery(movie, query);
  });
  results.innerHTML = highlightedHtmlMovies.join("");
}

// HIGHLIGHT QUERY

function highlightQuery(obj, qry) {
  const { title, rating } = obj;
  const original = title;
  const substring = new RegExp(qry, "gi"); // 'g' for global and 'i' for case-insensitive
  const highlightedHtmlTitle = original.replace(
    substring,
    `<span class="query-highlight">${qry}</span>`
  );
  return `
       <li>
         <span>${highlightedHtmlTitle}</span>
         <span>${rating}</span>
       </li>
     `;
}
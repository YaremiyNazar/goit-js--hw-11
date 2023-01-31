import fetchImages from "./js/fetchImages"
import LoadBtn from "./js/load-btn"
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const { searchForm, gallery, loadMoreBtn, endText } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endText: document.querySelector('.text'),
};
let currentPage = 1;
let currentHits = 1;
let searchQuery = '';


const loadBtn = new LoadBtn({
 
  
  selector: "[data-action='load-more']",
  hidden: true
})
// ---------------------------

async function onSubmitSearchForm(event) {
    event.preventDefault();
    let searchQueryEl = event.currentTarget.searchQuery.value
    currentPage = 1;

  if (searchQueryEl === '') {
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }

  const response = await fetchImages(searchQueryEl, currentPage);
  currentHits = response.hits.length;
  
    if (response.totalHits < 39) {
        loadMoreBtn.classList.add('is-hidden');
        endText.classList.remove('text')
    } 
  else {
      loadMoreBtn.classList.remove('is-hidden');
        endText.classList.add('text')
  }
  
  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      createMarkup(response.hits);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        endText.classList.add('text')
    }
  } catch (e) {
    console.log(e.message);
  }
}

searchForm.addEventListener('submit', onSubmitSearchForm);



async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  createMarkup(response.hits);
  currentHits += response.hits.length;
}
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);


function createMarkup(array) {
    const result = array.map((hits
    ) => `<div class="photo-card">
            <a a href="${(hits.largeImageURL)}">
            <img src="${hits.webformatURL}" alt="${hits.tags}" class="gallery__image" loading="lazy" width="240px" /></a>
            <div class="info">
                <p class="info-item"><b>Likes: </b>${hits.likes}</p>
                <p class="info-item"><b>Views: </b>${hits.views}</p>
                <p class="info-item"><b>Comments: </b>${hits.comments}</p>
                <p class="info-item"><b>Downloads: </b>${hits.downloads}</p>
            
            </div>
      </div>`).join("")
    gallery.insertAdjacentHTML("beforeend", result)
    const lightbox = new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 });
}








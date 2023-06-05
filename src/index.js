'use strict';
import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


axios.defaults.baseURL = 'https://pixabay.com/api/';
const load = document.querySelector('.load-more');
let page = 1;
let userQuery = '';
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

load.classList.add('invisible');


async function getPictures(searchRequest, page) {
  const galleryPictures = await axios.get(
    `?key=37043269-bb47305c6baa743caf5a51673&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return galleryPictures.data;
};

function addPictures() {
  page += 1;
    userQuery = searchForm.searchQuery.value;
    console.log(page);
  getPictures(userQuery, page).then(galleryPictures => {
    const Pictures = galleryPictures.hits
      .map(
        gallery => `<a class="gallery-link" href="${gallery.largeImageURL}"><div class="photo-card">
        <img src="${gallery.webformatURL}" alt="${gallery.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
    <b>Likes</b> ${gallery.likes}
  </p>
  <p class="info-item">
    <b>Views</b> ${gallery.views}
  </p>
  <p class="info-item">
    <b>Comments</b> ${gallery.comments}
  </p>
  <p class="info-item">
    <b>Downloads</b> ${gallery.downloads}
  </p>
        </div>
        </div></a>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', Pictures);
    const allRecords = Math.ceil(galleryPictures.totalHits / 40);
    if (page >= allRecords) {
      load.classList.add('invisible');
      return Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function buildGallery(e) {
  e.preventDefault();
    gallery.innerHTML = '';
    page = 1;
  load.classList.add('invisible');
  userQuery = searchForm.searchQuery.value;

  getPictures(userQuery, page).then(galleryPictures => {
    if (galleryPictures.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const allPictures = galleryPictures.hits
        .map(
          galleryItem => `<a class= "gallery-link" href="${galleryItem.largeImageURL}"><div class="photo-card">
          <img src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" />
          <div class="info">
          <p class="info-item">
      <b>Likes</b> ${galleryItem.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${galleryItem.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${galleryItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${galleryItem.downloads}
    </p>
          </div>
          </div></a>`
        )
        .join('');
      gallery.insertAdjacentHTML('beforeend', allPictures);
      if (galleryPictures.totalHits > 40) {
        load.classList.remove('invisible');
      }
    }
  });
};
searchForm.addEventListener('submit', buildGallery);
load.addEventListener('click', addPictures);

import axios from 'axios';

export default async function fetchImages(value, page) {
const API_KEY = "33082531-c3ebb2607c03926ed241b93d6"
const URL = "https://pixabay.com/api"
  const filter = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${URL}${filter}`).then(response => response.data);
}
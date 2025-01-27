import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/search'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (searchTerm) => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if(data.response === 'False') {
        setErrorMessage(data.Error || 'failed to fetch movies');
        setMovieList([]);
        return;
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  return (
    <>
      <h1>Hey</h1> 
      <button className='text-gradient' onClick={() => setCount(count + 1)}>click me</button>
      <h2>You've clicked the button {count} times...</h2>
      <Search onSearch={(term) => setSearchTerm(term)} />
      <h2>{searchTerm}</h2>
      <section className='all-movies'>
        <h2>All Movies</h2>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </section>

    </>
  )
}

export default App

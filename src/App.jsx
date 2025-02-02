import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'


import { updateSearchCount, getTrendingMovies } from './appwrite'

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
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });
  // const [savCount, setSavCount] = useState(localStorage.getItem('count') || 0);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const endpoint = query
      ?
       `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

        setMovieList(data.results || []);

        if(query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
    
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally{
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchTrendingMovies();
  }, [])

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count])

  

  return (
    <>
      <h1>Hey</h1> 
      <button className='text-gradient' onClick={() => setCount(count + 1)}>click me</button>
      <h2>You've clicked the button {count} times...</h2>

      {trendingMovies.length > 0 && (
        <section className='trending'>
        <h2>Trending Movies</h2>
        <ul>
          {trendingMovies.map((movie, index) => (
            <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url} alt={movie.title} />
            </li>
          ))}
        </ul>
      </section>
      )}

      <Search onSearch={(term) => setSearchTerm(term)} />
      <section className='all-movies'>
      
        {searchTerm ? <h2 className='m-4'>{searchTerm}</h2> : <h2 className='m-4'>All Movies</h2> }
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie}/>
            ))}
          </ul>
        )}
      </section>

    </>
  )
}

export default App

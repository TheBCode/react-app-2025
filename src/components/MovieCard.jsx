import React from 'react'

const MovieCard = ({movie: { title, poster_path, overview }}) => {
  return (
    <li className='list-none my-5 flex flex-col items-center text-white'>
                <h3>{title}</h3>
                <img
                  className='w-64 rounded-lg border-2 border-gray-300 shadow-lg'  
                  src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
                  alt={title} 
                  />
                <p>{overview}</p>
              
              </li>
  )
}

export default MovieCard;
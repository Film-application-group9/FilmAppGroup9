import React, {useState} from 'react';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('');  
    const [language, setLanguage] = useState('');  
    const [releaseYear, setReleaseYear] = useState('');

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
        years.push(year);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (query) searchParams.append('query', query);
        if (genre) searchParams.append('genre', genre);
        if (language) searchParams.append('language', language);
        if (releaseYear) searchParams.append('release_year', releaseYear);
        const response = await fetch(`http://localhost:3001/search?${searchParams.toString()}`);
        const data = await response.json();

        if (response.ok) {
            setMovies(data.results);
            
          } else {
            alert('Search failed');
            
            }
        };

    return (
            <form onSubmit={handleSearch}>
            <h1>Search movies</h1>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter the title..."
                />
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Science Fiction">Science Fiction</option>
            </select>

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Finnish">Finnish</option>
                <option value="German">German</option>
            </select>

            <select value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)}>
                <option value="">Select Release Year</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

                <button type="submit">Search</button>
            <div className= "movie-results">
        {movies.length > 0 && (
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <p>{movie.release_date}</p>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};

export default MovieSearch;
  
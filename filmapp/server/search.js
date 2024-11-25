import fetch from "node-fetch";
const genres = {
    'Action': 28,
    'Comedy': 35,
    'Drama': 18,
    'Horror': 27,
    'Science Fiction': 878
};
const languages = {
    'English': 'en',
    'Spanish': 'es',
    'Finnish': 'fi',
    'German': 'de',
};

    const searchHandler = (apiKey) => async (req, res) => {
        try {
        const { query, genre, language, release_year } = req.query;
        let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        if (language && languages[language]) {
            searchUrl += `&language=${languages[language]}`;
        }
        if (release_year) {
            searchUrl += `&primary_release_year=${release_year}`;
        }

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Search failed');
        }
        const genreId = genres[genre];
        const filteredResults = genreId
            ? data.results.filter((movie) => movie.genre_ids.includes(genreId))
            : data.results;

        res.json({ results: filteredResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export {searchHandler, languages, genres};
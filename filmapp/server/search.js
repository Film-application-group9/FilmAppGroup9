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
    let searchUrl =`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;
    if (query) searchUrl += `&query=${query}`;
    if (genre && genres[genre]) {
        searchUrl += `&with_genres=${genres[genre]}`;
    }
    if (language && languages[language]) {
        searchUrl += `&language=${languages[language]}`;
    }
    if (release_year) {
        searchUrl += `&primary_release_year=${release_year}`;
    }

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (response.ok) {
        res.json(data);
    } else {
        throw new Error('Search failed');
    }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export {searchHandler, languages, genres};
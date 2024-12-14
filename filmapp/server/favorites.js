let testFavorites = [];

const postUserFavorite = async (req, res) => {
    const { idUser, idMovie, title } = req.body;
    const exists = testFavorites.some(fav => fav.idUser === idUser && fav.idMovie === idMovie);
    if (!exists) {
        testFavorites.push({ idUser: String(idUser), idMovie: String(idMovie), title });
        res.status(201).send('movie added to favorites');
    } else {
        res.status(400).send('Movie already in favorites');
    }
}

const deleteUserFavorite = async (req, res) => {
    const { idUser, idMovie } = req.params;
    
    const index = testFavorites.findIndex(fav => fav.idUser === String(idUser) && fav.idMovie === String(idMovie));
    if (index !== -1) {
        testFavorites.splice(index, 1);
        res.status(200).send('movie removed from favorites');
    } else {
        res.status(404).send('movie not found in favorites');
    }
}

const getUserFavorites = async (req, res) => {
    const { idUser } = req.params;
    const userFavorites = testFavorites.filter(favorite => favorite.idUser === String(idUser));
    res.json(userFavorites);
}

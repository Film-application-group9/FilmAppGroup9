import { pool } from "../helpers/db.js";

const getAllGroups = async () => {
    return await pool.query('SELECT * FROM groups')
}

const getMemberStatus = async (groupId, userId) => {
    return await pool.query(`SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $1 AND groups_id_group = $2 AND is_owner = TRUE) THEN 2
    WHEN EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $1 AND groups_id_group = $2) THEN 1
    ELSE 0
  END;`, [userId, groupId])
}

const getShowtimes = async (groupId, userId) => {
    return await pool.query('SELECT * FROM group_showtimes WHERE id_group=$1 AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1)', [groupId, userId])
}

const getName = async (groupId) => {
    return await pool.query('SELECT groupname FROM groups WHERE id_group=$1', [groupId])
}

const getMovies = async (groupId, userId) => {
    return await pool.query('SELECT * FROM group_movies WHERE id_group=$1 AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1)', [groupId, userId])
}

const getUsers = async (groupId, userId) => {
    return await pool.query(`
    SELECT users_id_user, username, is_owner FROM users_in_groups INNER JOIN accounts ON users_id_user = id
    WHERE groups_id_group=$1 AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1)
    ORDER BY is_owner DESC`, [groupId, userId])
}

const getRequests = async (groupId, userId) => {
    return await pool.query(`
    SELECT DISTINCT group_requests.id_user, accounts.username FROM group_requests
    INNER JOIN users_in_groups ON group_requests.id_group = users_in_groups.groups_id_group
    INNER JOIN accounts ON group_requests.id_user = accounts.id 
    WHERE groups_id_group=$1 AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user =$2 AND groups_id_group=$1 AND is_owner = TRUE)`, [groupId, userId])
}

const getGroupsByUserId = async (userId) => {
    return await pool.query('SELECT id_group, groupname FROM users_in_groups INNER JOIN groups ON users_in_groups.groups_id_group = groups.id_group WHERE users_id_user=$1', [userId])
}

const insertGroup = async (groupname) => {
    return await pool.query('INSERT INTO groups (groupname) VALUES ($1) RETURNING *', [groupname])
}

const newGroup = async (groupname, userId) => {
    return await pool.query(`
    WITH inserted_group_id AS (
    INSERT INTO groups (groupname) VALUES ($1) RETURNING id_group
    )
    INSERT INTO users_in_groups (users_id_user, groups_id_group, is_owner) 
    VALUES ($2, (SELECT id_group FROM inserted_group_id), TRUE) 
    RETURNING *;`, [groupname, userId])
}

const removeUser = async (groupId, userId, targetUserId) => {
    return await pool.query(`
        DELETE FROM users_in_groups WHERE groups_id_group=$1 AND users_id_user=$2
        AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user =$3 AND groups_id_group=$1 AND is_owner = TRUE)`, [groupId, targetUserId, userId])
}

const removeSelf = async (groupId, userId) => {
    return await pool.query(`
        DELETE FROM users_in_groups WHERE groups_id_group=$1 AND users_id_user=$2
        AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user =$2 AND groups_id_group=$1 AND is_owner IS NOT TRUE)`, [groupId, userId])
}

const insertUsersInGroups = async (userId, groupId) => {
    return await pool.query('INSERT INTO users_in_groups (users_id_user, groups_id_group) VALUES ($1,$2) RETURNING *', [userId, groupId])
}

const addMovie = async (groupId,movieId,userId, moviename, moviename_original, imgPath) => {
    return await pool.query('INSERT INTO group_movies (id_group, id_movie, moviename, moviename_original, img_path) SELECT $1, $2, $4, $5, $6 WHERE EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $3 AND groups_id_group = $1)',[groupId,movieId,userId, moviename, moviename_original, imgPath])
}

const addShowtime = async (groupId, Showtime, place, userId, moviename_orig, moviename_finnish) => {
    return await pool.query('INSERT INTO group_showtimes (id_group, showtime, place, moviename_original, moviename_finnish) SELECT $1, $2, $3, $5, $6 WHERE EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $4 AND groups_id_group = $1)', [groupId, Showtime, place, userId, moviename_orig, moviename_finnish])
}

const addComment = async (groupId, userId, commentText, username) => {
    return await pool.query(`
        INSERT INTO group_comments (id_group, id_user, comment_time, comment_text, username)
        SELECT $1, $2, NOW(), $3, $4 
        WHERE EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1)`, [groupId, userId, commentText, username])
}

const addJoinRequest = async (groupId, userId) => {
    return await pool.query('INSERT INTO group_requests (id_group, id_user) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1)', [groupId, userId])
}

const checkJoinRequest = async (groupId, userId) => {
    return await pool.query('SELECT EXISTS (select 1 from group_requests where id_group=$1 AND id_user=$2)', [groupId, userId])
}

const deleteGroup = async (groupId, userId) => {
    return await pool.query(` 
WITH owner_check AS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1 AND is_owner = TRUE),
delete_child1 AS (DELETE FROM group_comments WHERE id_group = $1 AND EXISTS (SELECT 1 FROM owner_check)), 
delete_child2 AS (DELETE FROM group_showtimes WHERE id_group = $1 AND EXISTS (SELECT 1 FROM owner_check)), 
delete_child3 AS (DELETE FROM group_movies WHERE id_group = $1 AND EXISTS (SELECT 1 FROM owner_check)), 
delete_child4 AS (DELETE FROM group_requests WHERE id_group = $1 AND EXISTS (SELECT 1 FROM owner_check)), 
delete_child5 AS (DELETE FROM users_in_groups WHERE groups_id_group = $1 AND EXISTS (SELECT 1 FROM owner_check)) 
DELETE FROM groups WHERE id_group = $1 AND EXISTS (SELECT 1 FROM owner_check); 
`, [groupId, userId])
}

const denyJoinRequest = async (groupId, userId, targetUserId) => {
    return await pool.query(`
        DELETE FROM group_requests WHERE id_group=$1 AND id_user=$2
        AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user =$3 AND groups_id_group=$1 AND is_owner = TRUE)`, [groupId, targetUserId, userId])
}

const acceptJoinRequest = async (groupId, userId, targetUserId) => {
    return await pool.query(`
        WITH insert_operation AS (INSERT INTO users_in_groups (users_id_user, groups_id_group, is_owner) 
        SELECT $1, $2, FALSE
        WHERE EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $3 AND groups_id_group = $2 AND is_owner = TRUE
        )
        RETURNING users_id_user, groups_id_group
        )
        DELETE FROM group_requests WHERE id_group = $2 AND id_user = $1 AND EXISTS (SELECT 1 FROM insert_operation)`, [targetUserId, groupId, userId])
}

const getComments = async (groupId, userId) => {
    return await pool.query('SELECT * FROM group_comments WHERE id_group=$1 AND EXISTS (SELECT 1 FROM users_in_groups WHERE users_id_user = $2 AND groups_id_group = $1) ORDER BY comment_time DESC', [groupId, userId])
}


export {
    getAllGroups, insertGroup, insertUsersInGroups, getShowtimes, getMovies, getUsers, getGroupsByUserId, addMovie, addShowtime,
    newGroup, removeUser, removeSelf, addComment, addJoinRequest, deleteGroup, getRequests, getName, getMemberStatus, checkJoinRequest, denyJoinRequest,
    acceptJoinRequest, getComments
}
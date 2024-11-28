import { Router } from "express";
import jwt from 'jsonwebtoken';
import { getGroups, getUsersGroups, createGroup, getGroupShowtimes, getGroupMovies, getGroupUsers, addMovieToGroup, addShowtimeToGroup, removeUserFromGroup,
         removeSelfFromGroup, addCommentToGroup, addJoinRequestToGroup, removeGroup, getPendingRequests } from "../controllers/GroupsController.js";

const router = Router()


router.get('/', getGroups)
router.get('/mygroups/:userId', getUsersGroups)
router.get('/:groupId/showtimes', getGroupShowtimes)
router.get('/:groupId/movies', getGroupMovies)
router.get('/:groupId/users', getGroupUsers)
router.get('/:groupId/pending', getPendingRequests)

router.post('/creategroup/', createGroup)
router.post ('/:groupId/addmovie', addMovieToGroup)
router.post ('/:groupId/addshowtime', addShowtimeToGroup)
router.post ('/:groupId/addcomment', addCommentToGroup)
router.post ('/:groupId/joinrequest', addJoinRequestToGroup)

router.delete ('/:groupId/removegroup', removeGroup )
router.delete ('/:groupId/removeuser', removeUserFromGroup )
router.delete ('/:groupId/leavegroup', removeSelfFromGroup )

export default router
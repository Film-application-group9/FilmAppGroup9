import { Router } from "express";
import jwt from 'jsonwebtoken';
import { getGroups, getUsersGroups, createGroup, getGroupShowtimes, getGroupMovies, getGroupUsers, addMovieToGroup, addShowtimeToGroup, removeUserFromGroup,
         removeSelfFromGroup, addCommentToGroup, addJoinRequestToGroup, removeGroup, getPendingRequests, getMembershipStatus,
         getGroupName, checkGroupJoinRequest, denyGroupJoinRequest, acceptGroupJoinRequest, getGroupComments} from "../controllers/GroupsController.js";
import {auth} from "../helpers/auth.js"
const router = Router()


router.get('/', auth, getGroups)
router.get('/mygroups/:userId', auth, getUsersGroups)
router.get('/:groupId/groupname', auth, getGroupName)
router.get('/:groupId/membership/:userId', auth, getMembershipStatus)
router.get('/:groupId/showtimes/:userId', auth, getGroupShowtimes)
router.get('/:groupId/movies/:userId', auth,getGroupMovies)
router.get('/:groupId/users/:userId', auth,getGroupUsers)
router.get('/:groupId/pending/:userId', auth,getPendingRequests)
router.get('/:groupId/checkrequest/:userId', auth, checkGroupJoinRequest)
router.get('/:groupId/comments/:userId', auth, getGroupComments)

router.post('/creategroup/', auth, createGroup)
router.post ('/:groupId/addmovie',auth, addMovieToGroup)
router.post ('/:groupId/addshowtime', auth, addShowtimeToGroup)
router.post ('/:groupId/addcomment', auth, addCommentToGroup)
router.post ('/:groupId/joinrequest', auth, addJoinRequestToGroup)
router.post ('/:groupId/acceptrequest', auth, acceptGroupJoinRequest)


router.delete ('/:groupId/removegroup', auth, removeGroup )
router.delete ('/:groupId/removeuser', auth, removeUserFromGroup )
router.delete ('/:groupId/leavegroup', auth,removeSelfFromGroup )
router.delete ('/:groupId/denyrequest', auth, denyGroupJoinRequest )


export default router
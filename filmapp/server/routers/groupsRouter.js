import { Router } from "express";
import jwt from 'jsonwebtoken';
import { getGroups, getUsersGroups, createGroup, getGroupShowtimes, getGroupMovies, getGroupUsers, addMovieToGroup, addShowtimeToGroup, removeUserFromGroup,
         removeSelfFromGroup, addCommentToGroup, addJoinRequestToGroup, removeGroup, getPendingRequests, getMembershipStatus,
         getGroupName, checkGroupJoinRequest, denyGroupJoinRequest, acceptGroupJoinRequest, getGroupComments} from "../controllers/GroupsController.js";

const router = Router()


router.get('/', getGroups)
router.get('/mygroups/:userId', getUsersGroups)
router.get('/:groupId/groupname', getGroupName)
router.get('/:groupId/membership/:userId', getMembershipStatus)
router.get('/:groupId/showtimes/:userId', getGroupShowtimes)
router.get('/:groupId/movies/:userId', getGroupMovies)
router.get('/:groupId/users/:userId', getGroupUsers)
router.get('/:groupId/pending/:userId', getPendingRequests)
router.get('/:groupId/checkrequest/:userId', checkGroupJoinRequest)
router.get('/:groupId/comments/:userId', getGroupComments)

router.post('/creategroup/', createGroup)
router.post ('/:groupId/addmovie', addMovieToGroup)
router.post ('/:groupId/addshowtime', addShowtimeToGroup)
router.post ('/:groupId/addcomment', addCommentToGroup)
router.post ('/:groupId/joinrequest', addJoinRequestToGroup)
router.post ('/:groupId/acceptrequest', acceptGroupJoinRequest)


router.delete ('/:groupId/removegroup', removeGroup )
router.delete ('/:groupId/removeuser', removeUserFromGroup )
router.delete ('/:groupId/leavegroup', removeSelfFromGroup )
router.delete ('/:groupId/denyrequest', denyGroupJoinRequest )


export default router
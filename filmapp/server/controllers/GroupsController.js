import { compare, hash } from "bcrypt";
import { getAllGroups, insertGroup, insertUsersInGroups, getShowtimes, getMovies, getUsers, getGroupsByUserId, 
        addMovie, addShowtime, newGroup, removeUser, removeSelf, addComment, addJoinRequest, deleteGroup, getRequests,
        getName, getMemberStatus, checkJoinRequest, denyJoinRequest, acceptJoinRequest, getComments } from "../models/Groups.js";
import { ApiError } from "../helpers/ApiError.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const { sign } = jwt

const getGroups = async (req,res,next) => {
    try {
        const result = await getAllGroups()
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getGroupName = async (req,res,next) => {
    try {
        const result = await getName(req.params.groupId)
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const getMembershipStatus = async (req,res,next) => {
    try {
        const result = await getMemberStatus(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const getGroupShowtimes = async (req,res,next) => {
    try {
        const result = await getShowtimes(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getGroupMovies = async (req,res,next) => {
    try {
        const result = await getMovies(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getGroupUsers = async (req,res,next) => {
    try {
        const result = await getUsers(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getGroupComments = async (req,res,next) => {
    try {
        const result = await getComments(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getUsersGroups = async (req,res,next) => {
    try {
        const result = await getGroupsByUserId(req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const getPendingRequests = async (req,res,next) => {
    try {
        const result = await getRequests(req.params.groupId, req.params.userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const addMovieToGroup = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await addMovie(req.params.groupId, req.body.movieId, req.body.userId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const addShowtimeToGroup = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await addShowtime(req.params.groupId, req.body.showtime, req.body.movieId, req.body.userId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const addCommentToGroup = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await addComment(req.params.groupId, req.body.userId, req.body.commentText)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const createGroup = async(req,res,next) => {
    console.log(req.body)
    try {
        if (!req.body.groupname || req.body.groupname.length === 0) return next(new ApiError('Invalid groupname',400))
        if (!req.body.userId) return next(new ApiError('UserId required',400))
        const result = await newGroup(req.body.groupname,req.body.userId)
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const removeUserFromGroup = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        if (req.body.userId == req.body.targetUserId) return next(new ApiError('Can\'t remove owner of group',400))
        const result = await removeUser(req.params.groupId,req.body.userId,req.body.targetUserId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const removeSelfFromGroup= async (req,res,next) => {
    console.log(req.body.userId,req.params.groupId)
    try {
        const result = await removeSelf(req.params.groupId,req.body.userId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const addJoinRequestToGroup = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await addJoinRequest(req.params.groupId, req.body.userId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const removeGroup = async (req,res,next) => {
    try {
        const result = await deleteGroup(req.params.groupId,req.body.userId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const checkGroupJoinRequest = async (req,res,next) => {
    try {
        const result = await checkJoinRequest(req.params.groupId,req.params.userId)
        return res.status(200).json(result.rows[0].exists)
    } catch (error) {
        return next(error)
    }
}

const denyGroupJoinRequest = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await denyJoinRequest(req.params.groupId,req.body.userId,req.body.targetUserId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

const acceptGroupJoinRequest = async (req,res,next) => {
    console.log(req.body,req.params.groupId)
    try {
        const result = await acceptJoinRequest(req.params.groupId,req.body.userId,req.body.targetUserId)
        return res.status(200).json(result.rowCount)
    } catch (error) {
        return next(error)
    }
}

export { getGroups, getUsersGroups, createGroup, getGroupShowtimes, getGroupMovies, getGroupUsers, addMovieToGroup, addShowtimeToGroup,
         removeUserFromGroup, removeSelfFromGroup, addCommentToGroup, addJoinRequestToGroup, removeGroup, getPendingRequests, getGroupName,
         getMembershipStatus, checkGroupJoinRequest, denyGroupJoinRequest, acceptGroupJoinRequest, getGroupComments }
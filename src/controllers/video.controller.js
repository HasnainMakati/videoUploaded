const db = require("../../models/index.js")
const video = db.video
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")
const {uploadOnCloudinary} = require("../utils/cloudinary.js")
const mongoose = require("mongoose")

const addVideo = async(req,res)=>{
    console.log("Register")
    const videoFile = req.file?.path;
    const {title,description} = req.body

    console.log("ADD VIDEO",{videoFile,title,description})
    if(!title || !description) throw new ApiError(400,"All fields are required")

    try {

        if(!videoFile) throw new ApiError(400,"Please upload video")

        const uploadCloudinary = await uploadOnCloudinary(videoFile)
        if (!uploadCloudinary) {
            throw new ApiError(400, "Image upload failed");
        }       

        await video.create({videoUrl:uploadCloudinary,title,description})
        
        return res
        .json(new ApiResponse(200,"Video uploaded successfully"))
    } catch (error) {
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const editVideo = async(req,res)=>{

    const {id,title,description} = req.body
    const videoFile = req.file?.path;
    try {

        if(!mongoose.isValidObjectId(id)) throw new ApiError(400,"Video id is required")
        if(!videoFile) throw new ApiError(400,"Please upload video")

        const findVideo = await video.findOne({_id: id, deletedAt: null})

        if(!findVideo || findVideo.length === 0) throw new ApiError(400,"There are no video in our list")

        const uploadCloudinary = await uploadOnCloudinary(videoFile)

        if (!uploadCloudinary) {
            throw new ApiError(400, "video upload failed");
        }

        findVideo.videoUrl = uploadCloudinary
        findVideo.title = title
        findVideo.description = description
        await findVideo.save()
        console.log('EDIT VIDEO')
        return res
        .json(new ApiResponse(200,"Video Updated successfully"))
    } catch (error) {
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const deleteVideo = async(req,res)=>{
    const {id} = req.query

    try {

        if(!mongoose.isValidObjectId(id)) throw new ApiError(400,"Valid video id is required")

        const findVideo = await video.findOne({_id: id, deletedAt: null})

        
        if(!findVideo) throw new ApiError(400,"There are no video in our list")
            
        findVideo.deletedAt = new Date()
        await findVideo.save()

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Delete Video No : ${id}`))

    } catch (error) {
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const restoreVideo = async(req,res)=>{
    const {id} = req.query

    try {

        if(!mongoose.isValidObjectId(id)) throw new ApiError(400,"Valid video id is required")

        const findVideo = await video.findOne({_id: id})

        if(!findVideo) throw new ApiError(400,"There are no video in our list")

        findVideo.deletedAt = null
        await findVideo.save()

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Restore Video No : ${id}`))

    } catch (error) {
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const getAllVideo = async(req,res)=>{
    const videos = await video.find({deletedAt: null});
    
    if(!videos) throw new ApiError(400,"No one video found")
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"All videos fetched"))
}
module.exports = {addVideo ,editVideo,deleteVideo,restoreVideo,getAllVideo}

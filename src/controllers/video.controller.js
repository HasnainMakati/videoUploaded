const db = require("../../models/index.js")
const video = db.video
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")
const {uploadOnCloudinary} = require("../utils/cloudinary.js")
const { sequelize } = require("../db/index.js")
const fs = require("fs")

const addVideo = async(req,res)=>{
    console.log("Register")
    const videoFile = req.file?.path;
    const {title,description} = req.body

    console.log("ADD VIDEO",{videoFile,title,description})
    if(!title || !description) throw new ApiError(400,"All fields are required")

    const t = await sequelize.transaction()
    try {

        if(!videoFile) throw new ApiError(400,"Please upload video")

        const uploadCloudinary = await uploadOnCloudinary(videoFile)

        if (!uploadCloudinary) {
            throw new ApiError(400, "Image upload failed");
        }       

        const addToDb = await video.create({videoUrl:uploadCloudinary,title,description},{transaction:t})
        await t.commit();
        
        return res
        .json(new ApiResponse(200,"Video uploaded successfully"))
    } catch (error) {
        await t.rollback()
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const editVideo = async(req,res)=>{

    const {id,title,description} = req.body
    const videoFile = req.file?.path;
    const t = await sequelize.transaction();

    try {

        if(!videoFile) throw new ApiError(400,"Please upload video")

        const findVideo = await video.findOne({where:{id},attributes:['id','videoUrl','description','title'],transaction:t})

        if(!findVideo || findVideo.length === 0) throw new ApiError(400,"There are no video in our list")

        const uploadCloudinary = await uploadOnCloudinary(videoFile)

        if (!uploadCloudinary) {
            throw new ApiError(400, "video upload failed");
        }

        findVideo.videoUrl = uploadCloudinary
        findVideo.title = title
        findVideo.description = description
        await findVideo.save({transaction:t})
        await t.commit();
        return res
        .json(new ApiResponse(200,"Video Updated successfully"))
    } catch (error) {
        await t.rollback()
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const deleteVideo = async(req,res)=>{
    const {id} = req.query

    const t = await sequelize.transaction();
    try {

        if(!id) throw new ApiError(400,"Id is required")

        const findVideo = await video.findOne({where:{id},attributes:['id'],transaction:t})

        if(!findVideo) throw new ApiError(400,"There are no video in our list")

        await findVideo.destroy({transaction:t});
        await t.commit();

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Delete Video No : ${id}`))

    } catch (error) {
         if (t && t.finished !== 'commit' && t.finished !== 'rollback') {
            await t.rollback();
        }
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const restoreVideo = async(req,res)=>{
    const {id} = req.query

    const t = await sequelize.transaction();
    try {

        if(!id) throw new ApiError(400,"Id is required")

        const findVideo = await video.findOne({where:{id},attributes:['id'],paranoid:false,transaction:t})

        if(!findVideo) throw new ApiError(400,"There are no video in our list")

        await findVideo.restore({transaction:t});
        await t.commit();

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Restore Video No : ${id}`))

    } catch (error) {
         if (t && t.finished !== 'commit' && t.finished !== 'rollback') {
            await t.rollback();
        }
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const getAllVideo = async(req,res)=>{
    const videos = await video.findAll();
    
    if(!videos) throw new ApiError(400,"No one video found")
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"All videos fetched"))
}
module.exports = {addVideo ,editVideo,deleteVideo,getAllVideo}

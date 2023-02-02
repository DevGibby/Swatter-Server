import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateAdmin, validateUser } from '../JWT.js';

export const getBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    try {
        const bug = await ProjectModel.findOne({ 
            bugs: {
                $elemMatch: { _id: bugId}}},
            { 
                bugs:{ 
                    $elemMatch: { _id: bugId }
                }
            }
        )
        res.status(200).json(bug);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBug = async (req, res) => {
    const { title, author, description, status, priority, tag, images, sprint, bugKey } = req.body;
    const { projectId } = req.params;
    let token = req.headers.authorization
    const currentDate = new Date();
    if(validateUser(token)){
        try {
            await ProjectModel.findOneAndUpdate({ _id: projectId },
                {
                '$push': {
                    'bugs': {  
                        title,
                        description, 
                        date: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                        status, 
                        author,
                        priority,
                        tag,
                        sprint,
                        images,
                        bugKey,
                        lastUpdate: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                    }
                }
            })
            res.status(201).json("Bug Created");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid User')
    }
}

export const updateBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { description, status, priority, tag, sprint, images } = req.body;
    const currentDate = new Date();
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
    let token = req.headers.authorization;
    if(validateUser(token)){
        try {
            await ProjectModel.findOneAndUpdate(
                { "_id": projectId, "bugs._id": bugId },
                {
                    $set:{
                        "bugs.$.description": description,
                        "bugs.$.status": status,
                        "bugs.$.priority": priority,
                        "bugs.$.tag": tag,
                        "bugs.$.sprint": sprint,
                        "bugs.$.images": images,
                        "bugs.$.lastUpdate": currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                    }
                },
            );
            res.json("Bug Updated");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
} 

export const deleteBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
    let token = req.headers.authorization;
    if(validateAdmin(token)){
        try {
            await ProjectModel.findOneAndUpdate(
                { _id: projectId },
                { $pull: { 'bugs': { _id: bugId } } },
                { multi: true }
            )
            res.json("Bug Deleted");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}

export const deleteImage = async (req, res) => {
    const { projectId, bugId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No Bug with id: ${bugId}`);
    let token = req.headers.authorization;
    if(validateUser(token)){
        try { 
            await ProjectModel.findOneAndUpdate(
                { _id: projectId, 'bugs._id': bugId },
                {   
                    $set:{
                        "bugs.$.images": images,
                    }
                }
            )
            res.json("Image Deleted");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    }

export const createBugComment = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { comment, author } = req.body;
    const currentDate = new Date();
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
    let token = req.headers.authorization;
    if(validateUser(token)){
        try {
            await ProjectModel.findOneAndUpdate(
                { "_id": projectId, "bugs._id": bugId },
                {
                    $push:{
                        "bugs.$.comments": {
                            comment, 
                            date: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }), 
                            author
                        }
                    }
                },
            );
            res.json("Comment created!");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}

export const deleteBugComment = async (req, res) => {
    const { projectId, bugId, commentId } = req.params;  
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
    let token = req.headers.authorization;
    if(validateUser(token)){
        try {
            await ProjectModel.findOneAndUpdate(
                { "_id": projectId, "bugs._id": bugId },
                {
                    $pull:{
                        "bugs.$.comments": {
                            _id: commentId
                        }
                    }
                },
            );
            res.json("Comment Deleted!");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}
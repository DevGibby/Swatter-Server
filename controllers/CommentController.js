import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { comment } = req.body;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No Project Found')};
        if(!project.members.includes(user.id)){ return res.status(400).json('Invalid'); };

        let commentData = { user: user.username, comment: comment, date: currentDate };

        projectId.comments.unshift(commentData);

        await project.save();

        res.status(201).json("Comment created!");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    const { projectId, commentId } = req.params;

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};
        if(!project.members.includes(user.id)){ return res.status(400).json('Invalid'); };

        const comment = project.comments.find(comment => comment._id.toString() === commentId);
        if(!comment){ return res.status(400).json('No comment found')};
        if(comment.user !== user.username){ return res.status(403).json('Not authorized')};

        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $pull: { 'comments': { _id: commentId } } },
            { multi: true }
        );

        res.status(200).json("Comment Deleted");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
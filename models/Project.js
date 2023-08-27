import mongoose from 'mongoose';

// children
const ImagesSchema = new mongoose.Schema({
    image: String,
    caption: String,
})

const TicketCommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
    avatar: String,
})

const TicketSchema = new mongoose.Schema({
    title:  String,
    description: String,
    date: String,
    lastUpdate: String,
    images: [{ type: ImagesSchema, ref: 'ticketImage'}],
    status: String,
    author: String,
    priority: String,
    tag: String,
    sprint: String,
    comments: [{type: TicketCommentSchema, ref: 'ticketComment'}]
})

const CommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    user: String,
})

const SprintSchema = new mongoose.Schema({
    title: String,
    goal: String,
    color: String,
    endDate: String,
    updated: String,
    status: String,
    createdBy: String,
})

const MemberSchema = new mongoose.Schema({
    memberId: { type: String, unique: true, sparse: true, allowNull: true },
    username: String
})

const ActivitySchema = new mongoose.Schema({
    activity: String, 
    content: String,
    date: String,
    user: String,
})

// parent
const ProjectSchema = new mongoose.Schema({
    owner: String,
    title: String,
    startDate: String,   
    lastUpdate: String,
    image: String,
    link: String,
    description: String,
    repository: String,
    members: [{ type: MemberSchema, ref: "members" }],
    tickets: [{ type: TicketSchema, ref: "tickets" }],
    comments: [{ type: CommentSchema, ref: "comments" }],
    sprints: [{type: SprintSchema, ref: "sprints"}],
    activities: [{ type: ActivitySchema, ref: "activities"}]
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);

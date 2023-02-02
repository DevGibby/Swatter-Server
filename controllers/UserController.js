import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { UserModel } from "../models/User.js";
import { createTokens, validateAdmin } from "../JWT.js";

const router = express.Router();

export const createUser = async (req, res) => {
  const { username, password, role, userRole } = req.body;
  let token = req.headers.authorization;
  if(validateAdmin(token)){
    bcrypt.hash(password, 10).then((hash) => {
      UserModel.create({
        username: username,
        password: hash,
        role: userRole,
      })
      .then(() => {
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
    });
  } else {
    res.status(400).json('Invalid');
  }
};

export const loginUser = async (req, res) =>{
  const { username, password } = req.body;
  const currentDate = new Date();
  const user = await UserModel.findOneAndUpdate({username: username },{lastLogin: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' })});
  if (!user) res.status(400).json({ error: "Wrong Username or Password!" });
  const userPassword = user.password;
  bcrypt.compare(password, userPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username or Password!" });
    } else {
      const accessToken = createTokens(user);
      const updateUser = async () => await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { token: accessToken}}, 
        { new: true })
      updateUser();
      res.send(accessToken);
    }
  });
};

// not tested \0/
export const updateUser = async (req, res) =>{
  const { username, password, newpassword} = req.body;
  const userPassword = user.password;
  bcrypt.compare(password, userPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username or Password!" });
    } else {
      UserModel.findOneAndUpdate({username: username },{password: newpassword});
      res.json("User Updated");
    }
  });
};
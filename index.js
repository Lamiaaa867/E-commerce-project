import express from 'express'
import { config } from 'dotenv'
import path from 'path';
import { conectDB } from './DB/dbConnection.js';
import { iniateApp } from './src/utils/iniateApp.js';
config({path: path.resolve('./config/config.env')});

const app=express();

iniateApp(app,express)
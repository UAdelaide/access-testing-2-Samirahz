var express = require('express');
var route = express.Router();
var db = require('../db');

var CURRENT_BUYER_ID = 1;
var CURRENT
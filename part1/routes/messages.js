var express = require('express');
var route = express.Router();
var db = require('../db');
const { router } = require('../app');

var CURRENT_BUYER_ID = 1;
var CURRENT_SELLER_ID = 2;

router.get('/items', async (req, res) => {
    const [rows] = await db.query('
        SELECT bl.BookID, bi.Title, u,Name AS SellerName
        FROM BookListings bl
        JOIN BookInfo bi ON bl.BookInfoID = bi.BookInfoID
        JOIN Users u ON bl.')
}

)
const express = require("express");
const router = express.Router();

router.get('/:id', (req, res)  => {
    const {id} = req.params;
    const {active} = req.query;

    if(!/^\d+$/.test(id)){
        return res.status(400).json({error: "id must be a number"});
    }

    if(active !== undefined && active !== "true" && active !== "false"){
        return res 
            .status(400)
            .json({ error: "active must be 'true' or 'false'"});
    }

    let status = 'found';
    if(active === 'true') status = 'is active';
    if(active === 'false') status = 'is inactive';


    const userId = Number(id);
    const message = 
            active === undefined? `User ${userId} found` : `User ${userId} ${status}`;

    res.json({message});
});

module.exports = router;
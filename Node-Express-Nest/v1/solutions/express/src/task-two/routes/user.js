const express = require("express");
const router = express.Router();

router.get('/:id', (req, res)  => {
    const {id} = req.params;
    const {active} = req.query;

    if(!/^\d+$/.test(id)){
        throw new HttpError(400, "id must be a number");
    }

    if(active !== undefined && active !== "true" && active !== "false"){
        throw new HttpError(400, "active must bea 'true' or 'false'");
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
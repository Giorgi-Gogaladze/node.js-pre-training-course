const HttpError = require("../task-two/routes/HttpError");

function validateTodo({isCreate}){
    return(req, res, next) => {
        const body = req.body;

        if(body === null || typeof body !== "object" || Array.isArray(body)){
            throw new HttpError(400, "request body must bea  Json object");
        }

        const errors = [];

        if(body.title === undefined){
            if(isCreate) errors.push("title is required");
        } else if (typeof body.title !== "string"){
            errors.push("title mut be a string");
        } else if(body.title.trim().length === 0){
            errors.push("title cant be empty");
        } else if(body.title.trim().length > 100){
            errors.push("title must be at most 100 characters")
        } 

        if (body.description !== undefined) {
            if (typeof body.description !== "string") {
                errors.push("description must be a string");
            } else if (body.description.length > 500) {
                errors.push("description must be at most 500 characters");
            }
        }

        if(body.completed !== undefined && typeof body.completed !== 'boolean'){
            errors.push("completed must be a boolean");
        }

        if(errors.length > 0){
            throw new HttpError(400, errors.join("; "))
        }

        next();
    }
}

module.exports = validateTodo;
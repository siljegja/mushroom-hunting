/* 
CatchAsync() func for async functions
- to avoid all the try/catch callbacks
- must be wrapped around callbacks (routers, middleware)
- catches any errors and passes it to next
*/

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

/* 
func is the function we pass in
this returns a new function that has func execudted, and 
catches any errors and passes it to next
*/
Documentation of the different activities taking place in building the aplication TASK MANAGER

step 1: Reading through the backend principles and going through already done project

step 2: What is my project and what are the requirements (Bonus: what makes it different from a To_do_list_api?)



step 3: setting up the project
           - npx express-generator -filename // this is to create a basic express node.js project directory
           - deleting all the directories or files not required
           - changing from common js to ESM module
           - npm-check-updates // modify all packages to recently upgraded packages
           - Basic folder stuctures
           - Initial commit 

step 4: Setting up packages for API protection
        1. Helmet : Helmet is a middleware that helps secure your application by setting various HTTP headers. It protects against   common web vulnerabilities such as: 
            XSS (Cross-Site Scripting): Prevents the browser from executing malicious scripts injected into your application.
            Clickjacking: Protects users from unknowingly interacting with a malicious site disguised as your own.
            MIME-type sniffing: Prevents browsers from misinterpreting content types, which could lead to security vulnerabilities
            Enforces HTTPS: Can help ensure that connections to your server are secure.
        2. Cors : It is a mechanism that allows web browsers to make requests to a server on a different domain than the one the web page originated from. By default, browsers block such "cross-origin" requests for security reasons. CORS enables you to explicitly specify which origins are allowed to access your server's resources. 
        - second commit "adding API protection packages Helmet and cors"

step 5:  Setting up custom error handlers:
         - installing winston
         - creating a centralized error handling mechanism that logs errors and provides appropriate responses to the client using winston
         - defining appError class and errorHandler middleware 
step 6:  setting up the database:
         - installing postgresql
         - installing nodemon for development
         - installing dotenv to better manage the env file. adding 'config' object containing default port and log level
         - add to .env file the variables for port and log level
         - creating tables for users and tasks in database.js if non existent.
         - connecting to postgresql
step 7:  Setting up user authentification and tokens
         - installing bcryptjs, http-errors, jsonwebtoken
         - adding authentification middleware, controller and services
step 8:  Setting up task controllers and services 
         - create, delete, update, list, mark item as completed
step 9:  setting up user validation ?
step 10: setting up rate limiter
step 11: setting up routes
step 12: testing and debugging

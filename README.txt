1) index.js – the server “entry point”. index.js → sets up the Express server and connects everything

Creates the Express app (const app = express()).

Configures middleware (for example, express.static('public'), JSON/body parsers, logging).

Mounts route modules (for example, app.use('/calculator', calculatorRoutes)).

Starts the HTTP server (app.listen(port, ...)).

Think of index.js as your application’s control room. It wires everything together and turns the server on.

2) routes/... – the URL handlers. CalculatorRoutes.js → defines API routes (e.g. /calculator/add?num1=2&num2=4)

Defines what happens when a client calls a specific URL (for example, GET /calculator/add).

Reads inputs from the request (req.query, req.params, req.body).

Calls business logic (often placed in a controller or utility module) and returns a response.

Using routers keeps endpoints organised and modular. As your app grows, you can split features into files like CalculatorRoutes.js, UserRoutes.js, etc., and plug them into index.js.

3) public/index.html – the client UI.

A static web page that the browser loads when you visit /.

Contains your forms, inputs, and JavaScript that call your API routes (for example, submitting to /add?num1=..&num2=.. or using fetch('/minus?...')).

Served by Express with app.use(express.static('public')).
4) calculator.html → front-end UI that connects to the backend using fetch()
5) calculator.js (controller) → contains logic for each operation 

6)DOCKERFILE TEMPLATE, comments in dockerfiles only support #

# -----------------------------
# 1. Base image
# -----------------------------
# Use an official Node.js image as the base (replace 18 with your version)
FROM node:18-alpine

# -----------------------------
# 2. Set working directory
# -----------------------------
# All files inside the container will live in /app
WORKDIR /app

# -----------------------------
# 3. Copy package files first
# -----------------------------
# Copy only package.json and package-lock.json first for caching
COPY package*.json ./

# -----------------------------
# 4. Install dependencies
# -----------------------------
# This layer will be cached unless package files change
RUN npm install --production
# If you want dev dependencies too, use:
# RUN npm install

# -----------------------------
# 5. Copy project files
# -----------------------------
# Now copy the rest of your application code
COPY . .

# -----------------------------
# 6. Expose port
# -----------------------------
# Inform Docker which port your app listens on
EXPOSE 3000

# -----------------------------
# 7. Set environment variable (optional)
# -----------------------------
# NODE_ENV=production improves performance
ENV NODE_ENV=production

# -----------------------------
# 8. Start the application
# -----------------------------
# Use CMD to run your app (do not use npm start if your script has another name)
CMD ["npm", "start"]

7) Terminal, build image
docker build -t MyDockerName/imagenameInLowercase .
ex: docker build -t mariasg/module10 .
The dot at the end is to tell docker that you need the image in your current folder

to check that the image has been built run

docker images

8) create container

run
docker run -d -p 7080:8080 mariasg/module10

-d (detached mode)
This tells Docker to run the container in the background instead of locking your terminal.
Without -d, the container’s logs (like console output) fill your terminal, and you cannot type anything else until you stop it.

-p (port mapping)
This flag maps a port from your computer (host) to a port inside the container.

You can see that we used a different port as well as 8080. Docker gives us the ability that we can bind any 
available port to our application. So the first port is the port where we want the application to run, and the
second port is the port where the application runs internally and the one we exposed in our docker file. So
we can give any port for first port like 4000,5000,8080 or even 80. just keep in mind that that port must notbe used by something else already. The second port is always going to be 8080 as our application runs on
8080.
Once you have run that you can see the app running by using the command
This lists all containers and shows the port mapping:
docker ps -a

9)push image
This will create a public version of your app on Docker Hub in your account. Then you can use that image to 
be pulled on any remote server, and easily run that image on that remote server.
How you can use your pushed image:
Since it is stored remotely, you can do this from any machine:
Even if you buy a new laptop, switch OS, or deploy on a remote Linux server, you only need:
No need to reinstall Node, npm, or dependencies — the entire environment is inside the container.

docker push mariasg/module10

10)If you want to pull an image from dockerfile we can run:
docker pull downloads an image from a remote registry (like Docker Hub) onto your machine.

docker pull mariasg/module10

11)to stop the container run

docker stop IDfromTheImage

to know the id run:
docker ps

to know in which port is running
docker logs IDfromtheImage
docker logs 06b178b6c128

12)to check that the image is working got to
http://localhost:8080

//I had issues because the port that I selected in index.js is 3000 but I build the docker file on 8080, you need to match them

#####GITHUB SECRETS
Secrets are used inside GitHub Actions workflows, deployments, automation, or CI/CD pipelines without exposing them publicly.
Then GitHub Actions can log in to Docker Hub automatically using those values.

1) Create a repository
2) Inside the repository / Settings / Secrets and variables /Actions / New repository secret / 
We need to create two secrets, one with your username and the other with your password
Secret name	        Value
DOCKER_USERNAME	    Your Docker Hub username
DOCKER_PASSWORD	    Your Docker Hub access token or password

we will create an access token in Docker:

Go to Docker / Account settings / developer settings / personal access tokens / generate new token / read/write/delete permissions / generate

docker login -u mariasg


Create two secrets (variables is when the info is not sensitive):
//First secret
Docker_hub_access_username
*****

//second secret
Docker_hub_access_token
*******

3)GitHub Actions

create a folder called .github and inside a folder called workflows / then a file called cicd.yml
(preserve the indenting of the file)

About cicd.yml:
The name basically just tells GitHub the name of the whole workflow process. The second part will tell when to run the workflow,
which is mentioned as “on > push > main” telling us to activate this workflow whenever we push something in our main branch.
Next we mention the Job that needs to be carried out. We tell the workflow we are going to run a build job in this workflow (we can
also tell the workflow to run multiple jobs one after another). The build job is divided into two parts: the environment (runs-on and
strategy) that it needs to build in, and the steps that need to be carried out.

//TEMPLATE ///I only had to changed the tag name with my image name and docker username

name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]       # Triggers only when main gets updated

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [19.x]   # You can change to LTS: 18 or 20

    steps:

      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and Push Image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/module10:latest  # Image name you will see in Dockerhub

      - name: Print Image Digest
        run: echo "New image created: ${{ steps.docker_build.outputs.digest }}"

DevConnector 2.0
Social network for developers

This is a MERN stack application from the "MERN Stack Front To Back" course on Udemy. It is a small social network app that includes authentication, profiles and forum posts.

Updates since course published
Such is the nature of software; things change frequently, newer more robust paradigms emerge and packages are continuously evolving. Hopefully the below will help you adjust your course code to manage the most notable changes.

The master branch of this repository contains all the changes and updates, so if you're following along with the lectures in the Udemy course and need reference code to compare against please checkout the origionalcoursecode branch. Much of the code in this master branch is compatible with course code but be aware that if you adopt some of the changes here, it may require other changes too.

After completing the course you may want to look through this branch and play about with the changes.

Changes to GitHub API authentication
Since the course was published, GitHub has deprecated authentication via URL query parameters You can get an access token by following these instructions For this app we don't need to add any permissions so don't select any in the scopes. DO NOT SHARE ANY TOKENS THAT HAVE PERMISSIONS This would leave your account or repositories vulnerable, depending on permissions set.

It would also be worth adding your default.json config file to .gitignore If git has been previously tracking your default.json file then...

git rm --cached config/default.json
Then add your token to the config file and confirm that the file is untracked with git status before pushing to GitHub. GitHub does have your back here though. If you accidentally push code to a repository that contains a valid access token, GitHub will revoke that token. Thanks GitHub 🙏

You'll also need to change the options object in routes/api/profile.js where we make the request to the GitHub API to...

const options = {
  uri: encodeURI(
    `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
  ),
  method: 'GET',
  headers: {
    'user-agent': 'node.js',
    Authorization: `token ${config.get('githubToken')}`
  }
};
npm package request deprecated
As of 11th February 2020 request has been deprecated and is no longer maintained. We already use axios in the client so we can easily change the above fetching of a users GitHub repositories to use axios.

Install axios in the root of the project

npm i axios
We can then remove the client installation of axios.

cd client
npm uninstall axios
Client use of the axios module will be resolved in the root, so we can still use it in client.

Change the above GitHub API request to..

const uri = encodeURI(
  `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
);
const headers = {
  'user-agent': 'node.js',
  Authorization: `token ${config.get('githubToken')}`
};

const gitHubResponse = await axios.get(uri, { headers });
You can see the full change in routes/api/profile.js

uuid no longer has a default export
The npm package uuid no longer has a default export, so in our client/src/actions/alert.js we need to change the import and use of this package.

change

import uuid from 'uuid';
to

import { v4 as uuidv4 } from 'uuid';
And where we use it from

const id = uuid();
to

const id = uuidv4();
Addition of normalize-url package 🌎
Depending on what a user enters as their website or social links, we may not get a valid clickable url. For example a user may enter traversymedia.com or www.traversymedia.com which won't be a clickable valid url in the UI on the users profile page. To solve this we brought in normalize-url to well.. normalize the url.

Regardless of what the user enters it will ammend the url accordingly to make it valid (assuming the site exists). You can see the use here in routes/api/profile.js

Fix broken links in gravatar 🔗
There is an unresolved issue with the node-gravatar package, whereby the url is not valid. Fortunately we added normalize-url so we can use that to easily fix the issue. If you're not seeing Gravatar avatars showing in your app then most likely you need to implement this change. You can see the code use here in routes/api/users.js

Redux subscription to manage local storage 📥
The rules of redux say that our reducers should be pure and do just one thing.

If you're not familiar with the concept of pure functions, they must do the following..

Return the same output given the same input.
Have no side effects.
So our reducers are not the best place to manage local storage of our auth token. Ideally our action creators should also just dispatch actions, nothing else. So using these for additional side effects like setting authentication headers is not the best solution here.

Redux provides us with a store.subscribe listener that runs every time a state change occurs.

We can use this listener to watch our store and set our auth token in local storage and axios headers accordingly.

if there is a token - store it in local storage and set the headers.
if there is no token - token is null - remove it from storage and delete the headers.
The subscription can be seen in client/src/store.js

We also need to change our client/src/utils/setAuthToken.js so it now handles both the setting of the token in local storage and in axios headers. setauthToken.js in turn depends on client/src/utils/api.js where we create an instance of axios. So you will also need to grab that file.

With those two changes in place we can remove all setting of local storage from client/src/reducers/auth.js. And remove setting of the token in axios headers from client/src/actions/auth.js. This helps keep our code predictable, manageable and ultimately bug free.

Component reuse ♻️
The EditProfile and CreateProfile have been reduced to one component ProfileForm.js
The majority of this logic came from the refactrored EditProfile Component, which was initially changed to fix the issues with the use of useEffect we see in this component.

If you want to address the linter warnings in EditProfile then this is the component you are looking for.

Log user out on token expiration 🔐
If the Json Web Token expires then it should log the user out and end the authentication of their session.

We can do this using a axios interceptor together paired with creating an instance of axios.
The interceptor, well... intercepts any response and checks the response from our api for a 401 status in the response.
ie. the token has now expired and is no longer valid, or no valid token was sent.
If such a status exists then we log out the user and clear the profile from redux state.

You can see the implementation of the interceptor and axios instance in utils/api.js

Creating an instance of axios also cleans up our action creators in actions/auth.js, actions/profile.js and actions/post.js

Note that implementing this change also requires that you use the updated code in utils/setAuthToken.js Which also in turn depends on utils/api.js I would also recommending updating to use a redux subscription to mange setting of the auth token in headers and local storage.

Remove Moment 🗑️
As some of you may be aware, Moment.js which react-moment depends on has since become legacy code.
The maintainers of Moment.js now recommend finding an alternative to their package.

Moment.js is a legacy project, now in maintenance mode.
In most cases, you should choose a different library.
For more details and recommendations, please see Project Status in the docs.
Thank you.

Some of you in the course have been having problems installing both packages and meeting peer dependencies.
We can instead use the browsers built in Intl API.
First create a utils/formatDate.js file, with the following code...

function formatDate(date) {
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;
Then in our Education.js component, import the new function...

import formatDate from '../../utils/formatDate';
And use it instead of Moment...

<td>
  {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : 'Now'}
</td>
So wherever you use <Moment /> you can change to use the formatDate function.
Files to change would be...

Education.js
Experience.js
CommentItem.js
PostItem.js
ProfileEducation.js
ProfileExperience.js
If you're updating your project you will now be able to uninstall react-moment and moment as project dependencies.

React Router V6 🧭
Since the course was released React Router has been updated to version 6 which includes some breaking changes. You can see the official migration guide from version 5 here .

To summarize the changes to the course code
Instead of a <Switch /> we now use a <Routes /> component.

The <Route /> component no longer receives a component prop, instead we pass a element prop which should be a React element i.e. JSX. Routing is also now relative to the component.

For redirection and Private routing we can no longer use <Redirect />, we now have available a <Navigate /> component.

We no longer have access to the match and history objects in our component props. Instead of the match object for routing parameters we can use the useParams hook, and in place of using the history object to push onto the router we can use the useNavigate hook.

The above changes do actually clean up the routing considerably with all application routing in one place in App.js. Our PrivateRoute is a good deal simpler now and no longer needs to use a render prop.

With moving all of the routing to App.js this did affect the styling as all routes needed to be inside the original <section className="container">. To solve this each page component in App.js (any child of a <Route />) gets wrapped in it's own <section className="container">, So we no longer need that in App.js. In most cases this just replaces the outer <Fragment /> in the component.

The styling also affected the <Alert /> component as this will show in addition to other page components adding it's own <section> would mean extra content shift when the alerts show. To solve this the alerts have been given their own styling so they are position: fixed; and we get no content shift, which additionally makes for a smoother UI with the alerts popping up in the top right of the screen.

Quick Start 🚀
Add a default.json file in config folder with the following
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
Install server dependencies
npm install
Install client dependencies
cd client
npm install
Run both Express & React from root
npm run dev
Build for production
cd client
npm run build
Test production before deploy
After running a build in the client 👆, cd into the root of the project.
And run...

Linux/Unix

NODE_ENV=production node server.js
Windows Cmd Prompt or Powershell

$env:NODE_ENV="production"
node server.js
Check in browser on http://localhost:5000/

Deploy to Heroku
If you followed the sensible advice above and included config/default.json and config/production.json in your .gitignore file, then pushing to Heroku will omit your config files from the push.
However, Heroku needs these files for a successful build.
So how to get them to Heroku without commiting them to GitHub?

What I suggest you do is create a local only branch, lets call it production.

git checkout -b production
We can use this branch to deploy from, with our config files.

Add the config file...

git add -f config/production.json
This will track the file in git on this branch only. DON'T PUSH THE PRODUCTION BRANCH TO GITHUB

Commit...

git commit -m 'ready to deploy'
Create your Heroku project

heroku create
And push the local production branch to the remote heroku main branch.

git push heroku production:main
Now Heroku will have the config it needs to build the project.

Don't forget to make sure your production database is not whitelisted in MongoDB Atlas, otherwise the database connection will fail and your app will crash.

After deployment you can delete the production branch if you like.

git checkout main
git branch -D production
Or you can leave it to merge and push updates from another branch.
Make any changes you need on your main branch and merge those into your production branch.

git checkout production
git merge main
Once merged you can push to heroku as above and your site will rebuild and be updated.

App Info
Author
Brad Traversy Traversy Media

Version
2.0.0

License
This project is licensed under the MIT License

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = 3000;

const app = express();
connectDB();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads' , express.static('uploads'));



// using user router
app.use('/', require('./Routes/user'))
// using admin router 
app.use('/' , require('./Routes/admin'))


const users = [
  {
    id: 1,
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 25,
    email: 'jane@example.com',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    age: 28,
    email: 'alice@example.com',
  },
  {
    id: 4,
    name: 'Bob Brown',
    age: 35,
    email: 'bob@example.com',
  },
  {
    id: 5,
    name: 'Ella Davis',
    age: 29,
    email: 'ella@example.com',
  },
  {
    id: 6,
    name: 'Charlie Wilson',
    age: 32,
    email: 'charlie@example.com',
  },
];



const posts = [
  {
    id: 1,
    title: 'First Post',
    body: 'This is the first post body',
    authorId: 1, // User with ID 1 created this post
  },
  {
    id: 2,
    title: 'Second Post',
    body: 'This is the second post body',
    authorId: 2, // User with ID 2 created this post
  },
  {
    id: 3,
    title: 'Third Post',
    body: 'This is the third post body',
    authorId: 3, // User with ID 1 created this post
  },
  {
    id: 4,
    title: 'Fourth Post',
    body: 'This is the fourth post body',
    authorId: 4, // User with ID 2 created this post
  },
  {
    id: 5,
    title: 'Fifth Post',
    body: 'This is the fifth post body',
    authorId: 5, // User with ID 1 created this post
  },
];







// Route for retrieving data
app.get('/api/usersthis', (req, res) => {
  try {
    // Return the dummy data as JSON
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors and return a 500 Internal Server Error status code
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


// Route to retrieve users with pagination
app.get('/api/users', (req, res) => {
  try {
    const page = req.query.page || 1; // Get the page number from the query parameter
    const perPage = req.query.perPage || 5; // Get the number of users per page from the query parameter

    const start = (page - 1) * perPage;
    const end = start + perPage;

    const paginatedUsers = users.slice(start, end);
    
    res.status(200).json(paginatedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.post('/api/users', (req, res) => {
  try {
    const newUser = req.body; // User data from the request body
    newUser.id = users.length + 1; // Generate a new unique ID
    users.push(newUser); // Add the new user to the array
    res.status(201).json(newUser); // Return the created user with a 201 Created status code
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.put('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.status(200).json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



// Route to retrieve all posts with user references
app.get('/api/posts', (req, res) => {
  try {
    const postsWithUsers = posts.map((post) => {
      const user = users.find((user) => user.id === post.authorId);
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        author: user, // Include the user reference
      };
    });

    res.status(200).json(postsWithUsers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});







app.listen(PORT, () => {
  console.log(`our app is listening on port : ${PORT}`);
});

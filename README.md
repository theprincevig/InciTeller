# InciTeller

**A home for the stories behind our memories.**

InciTeller is a full-stack story-publishing platform where users can share their experiences, publish stories, upload cover images, save drafts, and manage their profiles.

The platform provides an authenticated dashboard for managing personal content and a public feed for discovering published stories. It is built with React, Node.js, Express.js, and MongoDB.

## Features

### Authentication and User Management

- User registration and login with secure password hashing.
- Session-based authentication using Express sessions.
- User profile management.
- Protected operations for authenticated users.

### Story Management

- Create, edit, and delete stories.
- Save stories as drafts or publish them publicly.
- View and manage personal stories from the dashboard.
- Upload story cover images using Cloudinary.

### User Interface

- Responsive interface built with React and Vite.
- Client-side routing with React Router.
- State management with Zustand.
- Styled using Tailwind CSS.

## Tech Stack

| Category         | Technologies               |
| ---------------- | -------------------------- |
| Frontend         | React, Vite, React Router  |
| State Management | Zustand                    |
| Styling          | Tailwind CSS               |
| Backend          | Node.js, Express.js        |
| Database         | MongoDB, Mongoose          |
| Authentication   | Express sessions, bcryptjs |
| Image Storage    | Cloudinary                 |
| Validation       | Zod                        |

## Project Structure

```text
InciTeller/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── configs/
│   ├── controllers/
│   ├── helpers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── package.json
│   └── server.js
├── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed before running the application:

- Node.js 18 or newer
- npm
- MongoDB Atlas or a locally running MongoDB instance
- A Cloudinary account for image uploads

## Environment Variables

Create a `.env` file inside the `server` directory.

Configure the following variables:

```env
PORT=3000
CLIENT_URL=your_client_url_local/deployed
ATLASDB_URI=your_mongodb_connection_string
EXPRESS_SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### Environment Variable Notes

- `PORT`: Port used by the Express server.
- `CLIENT_URL`: URL of the frontend application.
- `ATLASDB_URI`: MongoDB connection string. Despite its name, use the connection string appropriate to your database configuration.
- `EXPRESS_SESSION_SECRET`: Secret used to sign session identifiers.
- `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET`: Cloudinary credentials.
- `NODE_ENV`: Application environment.

**Important:** Never commit your actual `.env` file, database credentials, session secrets, or Cloudinary API secrets to GitHub.

## Installation

Clone the repository and navigate to the project directory.

```bash
git clone <your-github-repository-url>
cd InciTeller
```

Install the dependencies using the root scripts:

```bash
npm install
npm run install-frontend
npm run install-backend
```

Ensure these scripts are defined in the root `package.json`. If they are not, install the frontend and backend dependencies separately:

```bash
cd client
npm install
cd ../server
npm install
```

Configure the environment variables before starting the application.

## Running the Application

### 1. Start the Backend

Open a terminal at the project root:

```bash
cd server
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

### 2. Start the Frontend

Open a second terminal at the project root:

```bash
cd client
npm run dev
```

The frontend is typically available at:

```text
http://localhost:5173
```

The exact commands depend on the scripts configured in the respective `package.json` files.

## API Endpoints

The following are the main application endpoints.

### Authentication

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/register` | Register a new user                |
| POST   | `/api/auth/login`    | Log in                             |
| POST   | `/api/auth/logout`   | Log out                            |
| GET    | `/api/auth/session`  | Retrieve the current session state |

### Stories

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/api/stories`          | Retrieve stories                    |
| GET    | `/api/stories/:storyId` | Retrieve a specific story           |
| POST   | `/api/stories`          | Create a story                      |
| PATCH  | `/api/stories/:storyId` | Update a story                      |
| DELETE | `/api/stories/:storyId` | Delete a story                      |
| GET    | `/api/stories/me`       | Retrieve the current user's stories |

### Profile

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| GET    | `/api/users/me` | Retrieve the current user's profile |

All endpoints should be used according to their authentication requirements and the application's implemented authorization rules.

## How to Use InciTeller

1. Register an account or log in.
2. Open the dashboard to create a story.
3. Enter a title and story content.
4. Upload a cover image if desired.
5. Save the story as a draft or publish it.
6. View and manage your stories from the dashboard or profile area.

## Implementation Notes

- Authentication uses Express sessions.
- The application uses `incitellerSid` as its session cookie name.
- Story cover images are uploaded to Cloudinary, and their URLs are stored in MongoDB.
- MongoDB stores the application's persistent data.
- Production deployments should use appropriate cookie security settings, environment variables, and CORS configuration.

## AI Tools and Development Workflow

AI tools were used as development assistants during this project.

**Tools used:**

- Claude Code
- ChatGPT

**AI-assisted tasks:**

Document the specific tasks for which you actually used these tools. Examples include:

1. Exploring implementation approaches and planning application features.
2. Generating or refining React components and frontend functionality.
3. Developing or refining Express routes, controllers, and backend logic.
4. Understanding and troubleshooting implementation errors.
5. Improving project documentation and setup instructions.

Only include the tasks that accurately describe your development process.

**Tooling disclosure:** CodeZero and Kiro were not used for this submission. I encountered setup and authentication difficulties while attempting to configure the required coding tools and proceeded with Claude Code and ChatGPT instead.

AI-generated code was used as a development aid. The implementation should be reviewed, tested, and understood before submission.

## Future Improvements

Potential improvements include:

- Experience collections for grouping related stories.
- Story search and category filters.
- Likes and comments.
- Additional validation and automated tests.
- Improved production deployment and monitoring.

These are potential improvements, not claims about features already implemented.

## License

This project is licensed under the ISC License.

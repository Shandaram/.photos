# ./photos
As part of my MSc, I developed a full-stack social media application using Node.js, Express.js, and EJS, featuring user authentication, profile management, and dynamic content interaction with posts, likes, followers, and comments. The app supports light/dark modes, secure image uploads, and accessibility through mandatory alt text. The project uses an MVC design pattern for maintainability and uses a normalised, secure MySQL database.

## Features

- **Authentication & Authorization**:
  - Password hashing with **bcrypt**.
  - Session-based login management with **express-session** and **passport-local**.
  
- **User Interaction**:
  - Post creation, editing, and deletion.
  - Like and comment functionality.
  - Follow/unfollow system to connect users.
  - Search bar to find users.

- **Accessibility & Design**:
  - Light/dark mode toggle for user preferences.
  - Mandatory alt text for image uploads.
  - Responsive design.

- **Secure Image Uploads**:
  - Handled with **Multer**, supporting validation for file types and sizes.

- **Database**:
  - **MySQL** database accessed through **Knex.js** for structured queries and migrations.

- **Modular Architecture**:
  - Organized using the **MVC design pattern** for better separation of concerns.

## Technology Stack

- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Knex.js](https://knexjs.org/) for database interactions.

- **Frontend**:
  - [EJS](https://ejs.co/) for server-side templating.

- **Database**:
  - [MySQL](https://www.mysql.com/) accessed via **Knex.js**.

- **Development Tools**:
  - [Nodemon](https://nodemon.io/) for live reloading during development.

## Installation and Setup

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shandaram/.photos.git
   cd .photos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Create a MySQL database.
   - Configure the connection in the `.env` file.
   - Example `.env` file:
     ```env
     DB_HOST=localhost
     DB_USER=your-username
     DB_PASSWORD=your-password
     DB_NAME=photos_db
     SESSION_SECRET=your-secret-key
     ```

4. **Run the application**:
   - For development mode with live reload:
     ```bash
     npm run dev
     ```
   - For production mode:
     ```bash
     npm start
     ```

5. **Access the application**:
   Visit `http://localhost:3000` in your browser.

## Scripts

The `package.json` file includes the following scripts:
- `test`: Placeholder for future test scripts.
- `dev`: Runs the app in development mode using **nodemon**.
- `start`: Starts the app in production mode.

## Dependencies

### Runtime Dependencies:
- **bcrypt**: Password hashing.
- **bootstrap**: Frontend styling.
- **connect-session-sequelize**: Session store for MySQL.
- **dotenv**: Environment variable management.
- **ejs**: Templating engine.
- **express**: Web framework.
- **express-session**: Session handling.
- **knex**: SQL query builder.
- **multer**: File uploads.
- **mysql2**: MySQL client.
- **passport**: Authentication middleware.
- **passport-local**: Local authentication strategy.
- **validator**: String validation and sanitization.

### Development Dependencies:
- **nodemon**: For live-reloading during development.

---
**Note**: This project was developed for academic purposes and is not intended for production use without further refinement.

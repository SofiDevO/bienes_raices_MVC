Aquí está la documentación en formato Markdown para tu proyecto:


# Bienes Raíces MVC Project

![GitHub repo size](https://img.shields.io/github/repo-size/SofiDevO/bienes_raices_MVC)
![GitHub issues](https://img.shields.io/github/issues/SofiDevO/bienes_raices_MVC)
![GitHub](https://img.shields.io/github/license/SofiDevO/bienes_raices_MVC)

This project is a Node.js application structured following the MVC (Model-View-Controller) pattern, designed to manage real estate operations. It uses various technologies and tools to provide a robust and scalable web application.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Pug**: Template engine for Node.js used for rendering views.
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom designs.
- **MySQL**: Relational database management system.
- **Sequelize**: Promise-based Node.js ORM for MySQL, PostgreSQL, SQLite, and more.
- **dotenv**: Zero-dependency module to load environment variables from a `.env` file into `process.env`.
- **Nodemailer**: Module for Node.js applications to allow easy email sending.
- **bcrypt**: Library for hashing passwords.
- **express-validator**: Middleware for validating incoming request bodies in Express applications.

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SofiDevO/bienes_raices_MVC.git
   cd bienes_raices_MVC
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory based on `.env.example` and fill in your database and email credentials.

4. **Run the application:**

   - **Development mode with Nodemon:**

     ```bash
     npm run server
     ```

     This command starts the server using Nodemon, which automatically restarts the server on file changes.

   - **Production mode:**

     ```bash
     npm start
     ```

     This command starts the server in production mode.

5. **Compile Tailwind CSS (if changes made to styles):**

   ```bash
   npm run css
   ```

   This command compiles Tailwind CSS into a single CSS file (`public/css/app.css`) based on `public/css/tailwind.css`.

## Folder Structure

- **`controllers/`**: Contains controller functions to handle requests and responses.
- **`models/`**: Defines Sequelize models for interacting with the MySQL database.
- **`routes/`**: Defines application routes using Express Router.
- **`views/`**: Pug templates for rendering HTML views.
- **`public/`**: Static assets (CSS, images, etc.) served by Express.
- **`config/`**: Configuration files, including database connection setup (`db.js`).
- **`helpers/`**: Utility functions and modules used across the application.

## Contributing

Contributions are welcome! Please feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact SofiDev via email at sofi.dev@outlook.com.

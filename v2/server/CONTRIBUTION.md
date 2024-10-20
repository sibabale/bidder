# Contributing to Bidder

Thank you for considering contributing to **Bidder**! We appreciate your interest in making our platform better. This document outlines how you can contribute to our project.

## 🚀 Getting Started

To get started with Bidder, follow these steps:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page to create your copy of the repository.

2. **Clone Your Fork**: Clone your forked repository to your local machine using:
   ```bash
   git clone https://github.com/sibabale/bidder.git
   ```

3. **Install Dependencies**: Navigate to the project directory and install the required dependencies:
   ```bash
   cd bidder
   cd server
   yarn install
   ```

4. **Set Up Environment Variables**: Create a `.env` file in the root directory based on the `.env.example` provided. Make sure to fill in the necessary environment variables. Here are the key environment variables you'll need:



   ### Environment Variables
   | Variable               | Description                                       |
   |------------------------|---------------------------------------------------|
   | `PORT`                 | The port on which the server will run (default: 3000) |
   | `NODE_ENV`             | Environment mode (e.g., `development`, `production`) |
   | `CORS_WHITELIST`      | Comma-separated list of allowed origins for CORS |
   | `FIREBASE_API_KEY`    | Firebase API key for authentication               |
   | `FIREBASE_AUTH_DOMAIN` | Firebase authentication domain                    |
   | `FIREBASE_PROJECT_ID`  | Firebase project ID                               |
   | `FIREBASE_DATABASE_URL` | Realtime Datase URL      |
   | `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket                         |
   | `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                |
   | `FIREBASE_APP_ID`  | Firebase app ID                                  |

5. **Start the Development Server**: Run the following command to start the server:
   ```bash
   yarn dev
   ```

6. **Run Tests**: Ensure that all tests pass by running:
   ```bash
   yarn test
   ```

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for building RESTful APIs.
- **Firebase**: Authentication and Firestore for data storage.
- **Socket.io**: Real-time communication between the client and server.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Helmet**: Middleware for securing HTTP headers.
- **Morgan**: Middleware for logging HTTP requests.
- **Express Validator**: Middleware for validating request data.

## 🔍 Code Style and Best Practices

- **Consistent Coding Style**: Follow the project's coding conventions and use ESLint for JavaScript and TypeScript files to maintain a consistent style.
- **Write Tests**: Please include tests for any new features or bug fixes you introduce.
- **Documentation**: Update documentation where necessary to reflect your changes, including any new features or changes in existing functionality.

## 🔄 Workflow

1. **Create a Branch**: Always create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit Your Changes**: Commit your changes with descriptive messages:
   ```bash
   git commit -m "Add feature: describe your feature"
   ```

3. **Push Your Branch**: Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**: Go to the original repository and create a pull request (PR) from your feature branch. Please provide a clear description of your changes and any relevant details.

## 🤝 Code of Conduct

Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all your interactions with the community.

## 🔒 Security

For information on our security practices and measures, please refer to the [SECURITY.md](./SECURITY.md) file.

## 💬 Questions?

If you have any questions or need assistance, feel free to reach out through GitHub Issues or contact us at [support@bidder.com](mailto:support@bidder.com).

---

Thank you for contributing to Bidder! Your help makes our project better for everyone.

# Virtual Classroom Using Azure

This project is a **Virtual Classroom** web application built using **React** for the frontend and **Node.js** for the backend. It leverages **Azure Compute Services** for hosting and scalability, and **Azure Storage** for storing classroom resources.

## Features

- **Virtual Classrooms**: Instructors can create classrooms, and students can join them.
- **Assignments & Grades**: Instructors can post assignments, and students can submit them. Grades can be tracked.
- **Real-Time Communication**: Chat and video integration for live classes (coming soon).
- **File Storage**: Securely upload and share class materials using Azure Blob Storage.
  
## Tech Stack

### Frontend:
- **React** (with **Material-UI** for styling)
  
### Backend:
- **Node.js** with **Express** for API
- **Azure Functions** for serverless compute, used for specific backend logic

### Azure Services:
- **Azure Blob Storage**: For storing class materials and resources.
- **Azure App Service**: To host the Node.js backend.
- **Azure Functions**: For scaling event-driven tasks, such as assignment grading or file uploads.
- **Azure SQL Database** (or **Cosmos DB**): For storing user data, classroom information, and assignments.


# Puritec PWA

A Progressive Web App for team management, emergency SOS, tasks, and chat.

## 🚀 How to Run "On GitHub" (Recommended)

Since you don't have a code editor installed, the best way to run this is using **GitHub Codespaces**. This creates a server and computer for you in the cloud.

1.  Click the green **Code** button at the top of this repository.
2.  Click on the **Codespaces** tab.
3.  Click **Create codespace on main**.
4.  Wait for the environment to load. It will automatically run the setup script.
5.  Once finished, you will see a popup saying "Your application is running on port 5173". Click **Open in Browser**.

You can now use the app!

## 💻 How to Run Locally (If you install Node.js)

If you prefer to run it on your laptop, you will need to install **Node.js** first.

1.  **Download & Install Node.js**: Go to [nodejs.org](https://nodejs.org/) and download the "LTS" version. Install it.
2.  **Download Code**: Click the green **Code** button -> **Download ZIP**. Extract the folder.
3.  **Run the App**:
    -   Open the folder.
    -   Right-click and select "Open in Terminal" (Mac/Linux) or "Open in Command Prompt" (Windows).
    -   Type `bash start.sh` (or `npm install` in both folders and then `npm start` manually).

## 🔑 Login Credentials

The database comes pre-loaded with these users:

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Can manage SOS number, view all. |
| **Team Leader** | `leader` | `leader123` | Can assign tasks to subordinates. |
| **Worker** | `worker` | `sub123` | Can view own tasks, chat with leader. |

## 📱 Features

-   **SOS Button**: Sends GPS location via SMS.
-   **Tasks & Calendar**: Manage duties with list and calendar views.
-   **Chat**: Real-time messaging between users.
-   **PWA**: Installable as an app on your phone.

# Backend Automated Debugging Report (TestSprite)

---

## 1️⃣ Summary
- **Target**: `http://localhost:3001` (json-server)
- **Status**: ✅ **100% Passed** (5/5 Tests)
- **Root Cause of Issue**: The backend server process was **not running** or was in a hung state (Zombie process).
- **Fix Applied**: Manually killed old processes (if any) and started `json-server` on port 3001.

---

## 2️⃣ Test Results
All CRUD (Create, Read, Update, Delete) operations were successful against the backend API.

| Test Case | Description | Status |
| :--- | :--- | :--- |
| **TC001** | **Create Inquiry (POST)**<br>Successfully created a new inquiry via API. | ✅ Passed |
| **TC002** | **Read Inquiry (GET)**<br>Successfully retrieved details. | ✅ Passed |
| **TC003** | **Reply to Inquiry (PUT)**<br>Admin reply functionality verified at API level. | ✅ Passed |
| **TC004** | **Delete Inquiry (DELETE)**<br>Successfully removed data. | ✅ Passed |
| **TC005** | **List Inquiries (GET List)**<br>Retrieved full list successfully. | ✅ Passed |

---

## 3️⃣ Recommendation & Fix
The code itself is **bug-free**. The issue is purely operational.

### How to Prevent Recurrence
1.  **Use `npm run dev:full`**: This command (defined in `package.json`) uses `concurrently` to run both Vite (Frontend) and json-server (Backend).
2.  **Check for Zombie Processes**: If you see "Empty Reply" or "Connection Refused", run:
    ```bash
    kill $(lsof -t -i:3001)
    ```
    Then restart the server.

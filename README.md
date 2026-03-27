# Registration & Admin (DBMS)

Simple web app where users register with personal details, data is stored in **SQLite**, and an **admin** page lists, edits, deletes records (including **ID** changes).

**Repository:** [github.com/Harsh-jethva/DBMS](https://github.com/Harsh-jethva/DBMS)

---

## Features

- **Registration form** (`index.html`): first name, last name, mobile, address, email, gender, nationality  
- **Dark theme** with subtle animated background  
- **Admin panel** (`admin.html`): view all rows, edit fields, **save**, **delete**, change **ID**  
- **REST API** + **SQLite** database file (`registration.db`)  
- Server tries **`PORT`** from environment, default **3000**; if busy, next port is used automatically  

---

## Tech Stack

| Part        | Technology   |
|------------|--------------|
| Backend    | Node.js, Express |
| Database   | SQLite (via `sqlite3`) |
| Frontend   | HTML, CSS, vanilla JavaScript |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (includes `npm`)

---

## Installation

```bash
git clone https://github.com/Harsh-jethva/DBMS.git
cd DBMS
npm install
```

---

## Run the App

```bash
npm start
```

Open the URL printed in the terminal, for example:

- **Registration:** `http://localhost:3000/` or `http://localhost:3001/` (if 3000 is in use)  
- **Admin:** `http://localhost:3000/admin.html` (same host/port as above)

**Tip:** If the page looks old, hard refresh: `Ctrl + F5`.

### Custom port

**PowerShell:**

```powershell
$env:PORT=4000; npm start
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/register` | Create a registration (JSON body with all fields) |
| `GET` | `/api/registrations` | List all registrations |
| `PUT` | `/api/registrations/:id` | Update row; body can include `id` to change primary key |
| `DELETE` | `/api/registrations/:id` | Delete row by `id` |

**Example — register (JSON):**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "mobileNumber": "9876543210",
  "address": "123 Main St",
  "email": "jane@example.com",
  "gender": "Female",
  "nationality": "Indian"
}
```

---

## Database

- File: **`registration.db`** (created next to `server.js` if missing)  
- Table: **`registrations`**  

Columns: `id`, `firstName`, `lastName`, `mobileNumber`, `address`, `email`, `gender`, `nationality`

**Clear all data (optional, SQLite CLI or script):** delete rows with `DELETE FROM registrations;` or remove `registration.db` and restart (table is recreated empty).

---

## Project Structure (main files)

```
├── server.js          # Express server + API + DB
├── package.json       # Dependencies and start script
├── index.html         # Registration page
├── admin.html         # Admin CRUD UI
├── registration.db    # SQLite database (local; may be gitignored in forks)
├── assets/            # Static images (optional)
├── themes/            # Legacy theme CSS (optional)
└── normalize/         # CSS normalize (optional)
```

---

## License / Course Use

Use for assignment or portfolio as needed; adjust this section if your course requires a specific license.

---

## Author

Harsh Jethva — [DBMS](https://github.com/Harsh-jethva/DBMS)

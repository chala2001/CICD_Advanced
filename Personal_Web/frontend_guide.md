# Complete Guide to Building Your React Frontend

Welcome to Phase 2 of your Portfolio Web Application! Now that we have a solid Node.js and PostgreSQL backend, we are going to build the user interface using React.

## 1. What are React, Vite, and TailwindCSS?
* **React:** A JavaScript library for building user interfaces. Instead of writing one massive HTML file, React lets us build small, reusable "Components" (like a Navbar, or a Project Card).
* **Vite:** A blazing fast development server and build tool. It replaces older tools like Create React App (CRA) by starting instantly and updating the browser immediately when you save a file.
* **TailwindCSS:** A "utility-first" CSS framework. Instead of writing custom CSS classes in a separate file, you write pre-defined Tailwind classes directly inside your HTML/React elements (e.g., `<div className="bg-black text-white p-4">`).

## 2. Setting Up the Project
We started by creating the frontend folder and initializing React with Vite.

### Commands Used:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```
**Explanation:** 
This creates the standard React folder structure inside the `frontend` directory and downloads all the basic tools React needs to run.

## 3. Installing Additional Dependencies
Next, we needed styling tools, icons, and a way to talk to our backend.

### Commands Used:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react axios
```

**Explanation of Dependencies:**
* **`tailwindcss`, `postcss`, `autoprefixer`**: These three packages work together to process the Tailwind classes we write and generate the final CSS file. The `init -p` creates configuration files (`tailwind.config.js` and `postcss.config.js`).
* **`lucide-react`**: A library of beautiful, modern SVG icons (like GitHub, LinkedIn, Mail icons).
* **`axios`**: A popular library used to make HTTP requests. We will use it to fetch your portfolio data from the backend `http://localhost:5000/api/portfolio`.

## 4. Configuring Tailwind for a Professional Dark Theme
We updated `tailwind.config.js` to look inside our React `src/` folder for classes. We also added a custom modern font called **Inter** and a professional dark color palette (`dark-900`, `dark-800`, etc.).

We cleared the default Vite CSS in `src/index.css` and added the incredibly powerful `@tailwind` directives. We also added some smooth scrolling behavior and custom scrollbar styling for a polished look!

## 5. Building React Components
Instead of putting everything in `App.jsx`, we built modular, reusable pieces of UI inside the `src/components/` folder:

*   **`Navbar.jsx`:** A sticky navigation bar that blurs the background when scrolling and includes a mobile-friendly hamburger menu.
*   **`SectionHeader.jsx`:** A tiny, reusable component that ensures every section title (like "About Me") looks exactly the same with a blue underline.
*   **`Hero.jsx`:** The landing page view that shows your name, title, and buttons.
*   **`Skills.jsx` & `Projects.jsx`:** Display your abilities using mapping functions to loop over your arrays of data.
*   **`Contact.jsx`:** A fully functional form. 

### POSTing Contact Messages to the Backend
Inside `Contact.jsx`, when the user clicks "Send Message", this code runs:
```javascript
const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing 
    await axios.post('http://localhost:5000/api/contact', formData);
};
```
This is doing exactly what we tested in Phase 1 with `curl` or PowerShell, but doing it automatically from the browser!

## 6. Wiring it all together (`App.jsx`)
`App.jsx` is the master component. When the website loads, we use a React Hook called `useEffect` to fetch all the portfolio data from the Node.js backend:

```javascript
useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/api/portfolio');
        setPortfolioData(response.data);
    };
    fetchData();
}, []);
```

Until the data arrives, we show a spinning loading icon. Once the data (`response.data`) is ready, we pass the specific Javascript objects down to the smaller components using **Props**:
```jsx
<Hero data={portfolioData.hero} />
<About data={portfolioData.about} />
<Projects data={portfolioData.projects} />
```

## Phase 2 Complete! 🚀
You now have a fully functional React frontend running on your machine, dynamically pulling its content from a Node.js backend and a Dockerized PostgreSQL database! 

**To Start the Frontend:** Run `npm run dev` inside the `frontend` folder.

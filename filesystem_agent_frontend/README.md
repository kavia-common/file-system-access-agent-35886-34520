# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

If you access the dev server via a remote hostname/IP, Docker, or a tunneling URL and see “Invalid Host header”, see the section below on resolving host header checks.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Fix: "Invalid Host header" when accessing remotely (Docker/tunnel/IP)

Create React App uses Webpack Dev Server which validates the `Host` header. When accessing the dev server via a non-localhost host (e.g., an IP, Docker bridge, or a tunneling URL), you may encounter:

```
Invalid Host header
```

Use one of the options below in development:

- Recommended: Allow specific hosts
  1. Copy `.env.example` to `.env.development.local`.
  2. Set `ALLOWED_HOSTS` to include the hostnames you use, and bind to `0.0.0.0`:
     ```
     ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
     HOST=0.0.0.0
     PORT=3000
     ```
     Add additional hosts (e.g., your tunnel domain) to the comma-separated list as needed.

- Fallback (tunnels/unknown hosts): Disable host check (development only)
  1. In `.env.development.local`, set:
     ```
     DANGEROUSLY_DISABLE_HOST_CHECK=true
     HOST=0.0.0.0
     PORT=3000
     ```
  2. Restart `npm start`.
  WARNING: Use only in local development, not in production.

CRA reads these variables automatically; no code changes are required. This repository already includes a `.env.example` with these fields.

## Backend proxy

The app is configured with `"proxy": "http://localhost:3001"` in `package.json`. In development:
- Frontend requests to `/api/...` will be proxied to the backend (adjust `REACT_APP_API_BASE_URL` if you prefer absolute URLs).
- To target a different backend, create `.env.development.local` with:
  ```
  REACT_APP_API_BASE_URL=http://<backend-host>:3001/api
  ```

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

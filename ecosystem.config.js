module.exports = {
  apps: [
    {
      name: "pingvin-share-backend",
      cwd: "/opt/pingvin-share/backend",
      script: "npm",
      args: "run prod",
      env: {
        BACKEND_PORT: "8080",
        DATABASE_URL: "file:/opt/pingvin-share/data/pingvin-share.db",
        DATA_DIRECTORY: "/opt/pingvin-share/data",
        CLAMAV_HOST: "127.0.0.1",
        CLAMAV_PORT: "3310"
      }
    },
    {
      name: "pingvin-share-frontend",
      cwd: "/opt/pingvin-share/frontend",
      script: "node",
      args: ".next/standalone/server.js",
      env: {
        PORT: "7860",
        API_URL: "http://localhost:8080"
      }
    }
  ]
};  
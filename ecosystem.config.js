module.exports = {
    apps: [
      {
        name: "pingvin-share-backend",
        cwd: "/opt/pingvin-share/backend",
        script: "npm",
        args: "run prod",
        env: {
          DATABASE_URL: "file:/opt/pingvin-share/data/pingvin-share.db",
          DATA_DIRECTORY: "/opt/pingvin-share/data"
        }
      },
      {
        name: "pingvin-share-frontend",
        cwd: "/opt/pingvin-share/frontend",
        script: "node",
        args: ".next/standalone/server.js",
        env: {
          PORT: "7860"
        }
      }
    ]
  };  
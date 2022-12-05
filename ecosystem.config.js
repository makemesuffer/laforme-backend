module.exports = {
  apps: [
    {
      name: 'laforme-backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

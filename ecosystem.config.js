module.exports = {
  apps: [
    {
      name: 'sipharmony-device-manager',
      script: 'src/index.js',
      watch: false,
      error_file: './error.log',
      out_file: './output.log',
      env: {
        NODE_ENV: 'development',
        PORT: 6066
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}

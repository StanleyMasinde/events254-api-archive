require('dotenv').config()
module.exports = {

  development: {
    client: process.env.TEST_DB_CLIENT || 'sqlite3',
    connection: {
      filename: './dev.sqlite',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'my_db',
      user: process.env.DB_USER || 'username',
      password: process.env.DB_PASSWORD
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrations'
    }
  },

  staging: {
    client: process.env.DB_CLIENT || 'mysql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'my_db',
      user: process.env.DB_USER || 'username',
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: process.env.DB_CLIENT || 'mysql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'my_db',
      user: process.env.DB_USER || 'username',
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

}

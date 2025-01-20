import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {Pool} = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // This allows the connection even if the server certificate is self-signed
      },
})

const testDatabaseConnection = async () => {
    pool.query('SELECT current_database()', (err, res) => {
        if (err) {
          console.error('Error checking database:', err);
        } else {
          console.log('Connected to database:', res.rows[0].current_database);
        }
      });
  };
  
  
testDatabaseConnection();
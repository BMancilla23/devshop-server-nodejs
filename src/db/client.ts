import pkg from "pg"; // Importa todo el paquete como un objeto
const { Pool } = pkg; // Extrae el Pool del paquete

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

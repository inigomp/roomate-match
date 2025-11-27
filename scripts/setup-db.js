import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_REF = 'zouwkgggkttuljdayxrp';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdXdrZ2dna3R0dWxqZGF5eHJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTI2NywiZXhwIjoyMDc5NzUxMjY3fQ.b-tF3oLfXDTlq0M06mRKWn-Rlu2YruhaGHPAib9uCF8'; // User provided key

async function run() {
    const sqlPath = path.join(__dirname, '../schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL on project:', PROJECT_REF);

    try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Error executing SQL:', response.status, text);
            return;
        }

        const data = await response.json();
        console.log('SQL executed successfully:', data);
    } catch (error) {
        console.error('Failed to execute SQL:', error);
    }
}

run();

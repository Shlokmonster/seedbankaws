import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function resetPassword() {
  try {
    console.log('🔑 SeedBank Password Reset Tool');
    console.log('-------------------------------');

    const email = await question('Enter user email to reset: ');
    const newPassword = await question('Enter new password: ');

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [passwordHash, email]);

    console.log('✅ Password reset successfully!');
    console.log(`You can now login with ${email} and your new password!`);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    rl.close();
    await pool.end();
  }
}

resetPassword();

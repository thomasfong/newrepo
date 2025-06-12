const pool = require('../database/');
const bcrypt = require('bcryptjs');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = `
      INSERT INTO account (
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password, 
        account_type
      ) VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `;
    const result = await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      hashedPassword
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_id FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Email check error:', error);
    throw new Error('Could not check email existence');
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type, 
        account_password 
      FROM account 
      WHERE account_email = $1
    `;
    const result = await pool.query(sql, [account_email]);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Get account by email error:', error);
    throw new Error('Could not retrieve account');
  }
}

/* **********************
 *   Get account by ID
 * ********************* */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type 
      FROM account 
      WHERE account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Get account by ID error:', error);
    throw new Error('Could not retrieve account');
  }
}

/* **********************
 *   Update account details
 * ********************* */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql = `
      UPDATE account 
      SET 
        account_firstname = $1,
        account_lastname = $2,
        account_email = $3,
        account_updated = NOW()
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `;
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Update account error:', error);
    throw new Error('Could not update account');
  }
}

/* **********************
 *   Change account password
 * ********************* */
async function changePassword(account_id, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `
      UPDATE account 
      SET 
        account_password = $1,
        account_updated = NOW()
      WHERE account_id = $2
    `;
    await pool.query(sql, [hashedPassword, account_id]);
    return true;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error('Could not change password');
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  changePassword
};
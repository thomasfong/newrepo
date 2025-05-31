-- Task 1: Insert Tony Stark record
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Update Tony Stark to Admin
UPDATE account 
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 3: Delete Tony Stark record
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Select Sport category vehicles
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Task 6: Update image paths to include vehicles
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
	
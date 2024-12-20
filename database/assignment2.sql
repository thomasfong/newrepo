-- 1.Insert the following new record to the account table 
--Tony, Stark, tony@starkent.com, Iam1ronM@n

INSERT INTO "account" (account_firstname, account_lastname, account_email, account_password) 
	VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- 2. Modify the Tony Stark record to change the account_type to "Admin".

UPDATE "account" SET account_type = 'Admin' 
	WHERE account_id = 1;

-- 3. Delete the Tony Stark record from the database.

DELETE FROM "account" WHERE  account_id = 1;


-- 4.Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.

SELECT REPLACE('"Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.', 'small interiors', 'a huge interior')



-- 5. Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.

-- Data for table `classification`
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');

-- Data for table `inventory`
INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
  ), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through trafic during rush hour.',
    '/images/batmobile.jpg',
    '/images/batmobile-tn.jpg',
    65000,
    29887,
    'Black',
    1
  ), (
    'FBI',
    'Surveillance Van',
    '2016',
    'do you like police shows? You will feel right at home driving this van, come complete with surveillance equipments for and extra fee of $2,000 a month. ',
    '/images/survan.jpg',
    '/images/survan-tn.jpg',
    20000,
    19851,
    'Green',
    1
  ), (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the original Dog Car complete with fluffy ears.',
    '/images/dog-car.jpg',
    '/images/dog-car-tn.jpg',
    35000,
    71632,
    'Brown',
    1
  ), (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as off-roading whether that be on the the rocks or in the mud!',
    '/images/wrangler.jpg',
    '/images/wrangler-tn.jpg',
    28045,
    41205,
    'Orange',
    3
  ), (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/adventador.jpg',
    '/images/adventador-tn.jpg',
    417650,
    71003,
    'Blue',
    2
  ), (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rush-hour traffic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/aerocar.jpg',
    '/images/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    1
  ), (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. This beast comes with 60 inch tires giving you traction needed to jump and roll in the mud.',
    '/images/monster-truck.jpg',
    '/images/monster-truck-tn.jpg',
    150000,
    3998,
    'purple',
    1
  ), (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/escalade.jpg',
    '/images/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    4
  ), (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go off roading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    4
  ), (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. however with a little TLC it will run as good a new.',
    '/images/mechanic.jpg',
    '/images/mechanic-tn.jpg',
    100,
    200125,
    'Rust',
    5
  ), (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/model-t.jpg',
    '/images/model-t-tn.jpg',
    30000,
    26357,
    'Black',
    5
  ), (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/mystery-van.jpg',
    '/images/mystery-van-tn.jpg',
    10000,
    128564,
    'Green',
    1
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/fire-truck.jpg',
    '/images/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    4
  ), (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equipped with the siren which is convenient for college students running late to class.',
    '/images/crwn-vic.jpg',
    '/images/crwn-vic-tn.jpg',
    10000,
    108247,
    'White',
    5
  );


-- 6.Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', 'images/vehiles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
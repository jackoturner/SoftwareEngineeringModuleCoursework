-- USERS
INSERT INTO users (id, username) VALUES
(1, 'jack'),
(2, 'lewis'),
(3, 'sarah'),
(4, 'tom'),
(5, 'emily'),
(6, 'alex'),
(7, 'chris'),
(8, 'matt');

-- PUBS
INSERT INTO pubs (id, name, location) VALUES
(1, 'The Red Lion', 'London'),
(2, 'The Crown', 'London'),
(3, 'The Kings Arms', 'Manchester'),
(4, 'The White Horse', 'Bristol'),
(5, 'The Black Bull', 'Leeds'),
(6, 'The Royal Oak', 'Birmingham');

-- BEERS
INSERT INTO beers (id, name, brewery) VALUES
(1, 'Guinness', 'Guinness Ltd'),
(2, 'Heineken', 'Heineken'),
(3, 'Carling', 'Molson Coors'),
(4, 'Peroni', 'Asahi'),
(5, 'Stella Artois', 'AB InBev'),
(6, 'Camden Hells', 'Camden Brewery'),
(7, 'Punk IPA', 'BrewDog'),
(8, 'Birra Moretti', 'Heineken');

-- REVIEWS
INSERT INTO reviews (user_id, pub_id, beer_id, rating, review_text) VALUES
(1, 1, 1, 5, 'Perfect pint, great head'),
(2, 1, 2, 4, 'Nice and cold'),
(3, 2, 3, 3, 'Average pour'),
(4, 2, 4, 5, 'Really smooth'),
(5, 3, 5, 2, 'Flat and disappointing'),
(6, 3, 6, 4, 'Good quality pint'),
(7, 4, 7, 5, 'Excellent IPA'),
(8, 4, 8, 4, 'Crisp and refreshing'),
(1, 5, 2, 3, 'Not bad'),
(2, 5, 3, 2, 'Too warm'),
(3, 6, 4, 5, 'One of the best pints I have had'),
(4, 6, 1, 5, 'Perfect Guinness'),
(5, 1, 6, 4, 'Nice local pint'),
(6, 2, 7, 5, 'Top tier IPA'),
(7, 3, 8, 3, 'Decent but nothing special'),
(8, 4, 5, 4, 'Good quality lager');

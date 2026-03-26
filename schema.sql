SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS pub_beers;
DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS pubs;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS=1;

-- USERS
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  bio TEXT,
  profile_image VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- PUBS
CREATE TABLE pubs (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- BEERS
CREATE TABLE beers (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brewery VARCHAR(255),
  type VARCHAR(100),
  abv DECIMAL(3,1),
  PRIMARY KEY (id)
);

-- PUB_BEERS
CREATE TABLE pub_beers (
  pub_id INT NOT NULL,
  beer_id INT NOT NULL,
  is_available TINYINT(1) DEFAULT 1,
  PRIMARY KEY (pub_id, beer_id),
  FOREIGN KEY (pub_id) REFERENCES pubs(id) ON DELETE CASCADE,
  FOREIGN KEY (beer_id) REFERENCES beers(id) ON DELETE CASCADE
);

-- REVIEWS
CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  pub_id INT NOT NULL,
  beer_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  ai_pour_score DECIMAL(3,2),
  image_url VARCHAR(255),
  comment TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pub_id) REFERENCES pubs(id) ON DELETE CASCADE,
  FOREIGN KEY (beer_id) REFERENCES beers(id) ON DELETE CASCADE
);

-- USERS DATA
INSERT INTO users VALUES
(1,'Sujal','Shah','sujal@example.com','hash1','2005-04-12',NULL,NULL,NOW()),
(2,'Luke','Pring','luke@example.com','hash2','2003-09-21',NULL,NULL,NOW()),
(3,'Jack','Turner','jack@example.com','hash3','2001-06-10',NULL,NULL,NOW()),
(4,'Victor','Tepeniuc','victor@example.com','hash4','1999-06-11',NULL,NULL,NOW()),
(5,'Alec','Thompson','alec@example.com','hash5','2002-07-01',NULL,NULL,NOW()),
(6,'Emily','Clark','emily@example.com','hash6','2000-03-15',NULL,NULL,NOW()),
(7,'Tom','Harris','tom@example.com','hash7','1998-11-02',NULL,NULL,NOW()),
(8,'Sarah','Jones','sarah@example.com','hash8','2004-01-25',NULL,NULL,NOW()),
(9,'Chris','Evans','chris@example.com','hash9','1997-08-19',NULL,NULL,NOW()),
(10,'Matt','Green','matt@example.com','hash10','2001-12-05',NULL,NULL,NOW());

-- PUBS DATA
INSERT INTO pubs VALUES
(1,'The Red Lion','Putney High Street','SW15 1AA',51.4613,-0.2167,'Local pub',NOW()),
(2,'The Kings Arms','Roehampton Lane','SW15 5PJ',51.4500,-0.2420,'Student pub',NOW()),
(3,'The White Horse','Oxford Street','W1D 1BS',51.5154,-0.1410,'Central pub',NOW()),
(4,'The Black Bull','Camden High Street','NW1 0JH',51.5390,-0.1426,'Busy pub',NOW()),
(5,'The Crown','Clapham Common','SW4 7AA',51.4625,-0.1380,'Modern pub',NOW());

-- BEERS DATA
INSERT INTO beers VALUES
(1,'Doom Bar','Sharp''s','Ale',4.0),
(2,'Peroni','Peroni','Lager',5.1),
(3,'Punk IPA','BrewDog','IPA',5.4),
(4,'Moretti','Heineken','Lager',4.6),
(5,'Guinness','Guinness','Stout',4.2),
(6,'Camden Hells','Camden','Lager',4.6);

-- PUB_BEERS DATA
INSERT INTO pub_beers VALUES
(1,1,1),(1,2,1),(1,5,1),
(2,2,1),(2,3,1),(2,6,1),
(3,4,1),(3,5,1),
(4,3,1),(4,6,1),
(5,1,1),(5,5,1);

-- REVIEWS DATA
INSERT INTO reviews (user_id,pub_id,beer_id,rating,ai_pour_score,comment) VALUES
(1,1,1,5,4.8,'Perfect pint'),
(2,1,2,4,4.2,'Nice lager'),
(3,2,3,5,4.9,'Top IPA'),
(4,2,6,4,4.1,'Smooth'),
(5,3,4,3,3.5,'Average'),
(6,3,5,5,4.9,'Great Guinness'),
(7,4,3,2,2.9,'Flat'),
(8,4,6,4,4.0,'Decent'),
(9,5,1,5,4.7,'Excellent'),
(10,5,5,4,4.3,'Good stout');
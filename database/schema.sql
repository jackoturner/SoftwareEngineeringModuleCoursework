CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pubs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT
);

CREATE TABLE beers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  brewery VARCHAR(100)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  pub_id INT,
  beer_id INT,
  rating INT,
  review_text TEXT,
  ai_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pub_id) REFERENCES pubs(id),
  FOREIGN KEY (beer_id) REFERENCES beers(id)
);
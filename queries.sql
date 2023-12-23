CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category VARCHAR(40) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description VARCHAR(2000),
  rating INT,
  image TEXT,
  category_id INT REFERENCES categories(id)
);

INSERT INTO categories (category) VALUES ('Christmas'), ('Halloween'), ('Easter'), ('Adventure'), ('Fairytail'), ('Other');

INSERT INTO books (title, author, description, rating, image, category_id) VALUES ('Shaggy Dog and the Terrible Itch', 'David Bedford and Gwyneth Williamson', 'Shaggy dog has an incessant itch. Each attempt to alleviate it involves doing favors for friends. He rounds up sheep, washes dishes, and sweeps up dog hair, receiving back scratches in return. However, the itch persists until Mary Lou gives him a haircut and shampoo, transferring the itch to a snooty poodle. Kids enjoy discovering the cause of Shaggy Dogs itch. Humorous, full-color illustrations accompany the story.', '7', 'https://m.media-amazon.com/images/I/41R5AMWYVNL._SX218_BO1,204,203,200_QL40_ML2_.jpg', '6');
INSERT INTO books (title, author, description, rating, image, category_id) VALUES ('The Night Before Christmas', 'Clement Clarke Moore', 'On the night of Christmas Eve, a family is settling down to sleep when the father is awakened by noises on their lawn. Looking out the window, he sees Santa Claus (Saint Nicholas) in a sleigh pulled by eight reindeer. After landing his sleigh on the roof, Santa gets down the chimney. He carries a sack of toys, and the father watches his visitor deliver presents and fill the stockings hanging by the fireplace, and laughs to himself. They share a conspiratorial moment before Santa bounds up the chimney again. As he flies away, Santa calls out "Happy Christmas to all, and to all a good night.', '8', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388370094i/196970.jpg', '1');
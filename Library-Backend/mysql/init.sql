-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    role VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    available BIT(1) NOT NULL,
    genre VARCHAR(255),
    isbn VARCHAR(255) NOT NULL,
    publication_year VARCHAR(255),
    quantity INT NOT NULL,
    title VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create loans table with foreign key constraints
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrowed_date DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_date DATE,
    book_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Create indexes for better performance
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_loans_dates ON loans(borrowed_date, due_date, returned_date);
CREATE INDEX idx_users_email ON users(email);

-- Optional: Insert initial admin user
-- Password should be properly hashed in a real application
INSERT IGNORE INTO users (email, full_name, password, role)
VALUES ('admin@library.com', 'Librarian', '$2a$10$57YI3zuKaJZv6Dxq62w.MeWdssF1H3hh6hgJNO/bFkylOmmb0nUN2', 'LIBRARIAN');
BEGIN TRANSACTION;

CREATE TABLE
    users (
        ID serial PRIMARY KEY,
        name VARCHAR(100),
        email text UNIQUE NOT NULL,
        entries BIGINT DEFAULT 0,
        joined TIMESTAMP NOT NULL
    );

COMMIT;
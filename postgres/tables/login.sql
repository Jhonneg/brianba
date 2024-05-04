BEGIN TRANSACTION;

CREATE TABLE
    login (
        ID serial PRIMARY KEY,
        hash VARCHAR(100) NOT NULL,
        email text UNIQUE NOT NULL
    );

COMMIT;
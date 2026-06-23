-- The database was created in SQL Server Management Studio.
-- Run these sql commands to create the tables

CREATE TABLE Recipes (
	id INT IDENTITY(1,1) PRIMARY KEY,
	recipe_name VARCHAR(255),
	recipe_type VARCHAR(255)
);

CREATE TABLE Ingredients (
	id INT IDENTITY(1,1) PRIMARY KEY,
	recipe_id INT,
	ingredient VARCHAR(255),
	measurement_size DECIMAL,
	measurement_type VARCHAR(255),
	measurement_unit VARCHAR(8)
);

CREATE TABLE Instructions (
	id INT IDENTITY(1,1) PRIMARY KEY,
	recipe_id INT,
	ingredient_id INT,
	step INT,
	instruction VARCHAR(1000)
);
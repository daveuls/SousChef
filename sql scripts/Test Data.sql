-- Test values inserted into the database. Run these commands to manually insert these test values.

INSERT INTO dbo.Ingredients
VALUES (1,'Hot Dog', 1, null, null)

INSERT INTO dbo.Ingredients
VALUES (1, 'Bun', 1, null, null)



INSERT INTO dbo.Recipes
VALUES ('Hot Dogs', 'Lunch/Dinner')


INSERT INTO dbo.Instructions
VALUES (1, null, 1, 'Preheat the grill to 400 degrees fahrenheit' )

INSERT INTO dbo.Instructions
VALUES (1, 1, 2, 'Once the grill is preheated, place the hotdog on the grill and let cook for 3 minutes per side' )

INSERT INTO dbo.Instructions
VALUES (1, 2, 3, 'After 3 minutes, flip the hot dog. Place a bun on the top rack for 1-2 minutes.' )

INSERT INTO dbo.Instructions
VALUES (1, null, 4, 'Remove the bun after 1-2 minutes and let hotdog cook for remaining time.' )

INSERT INTO dbo.Instructions
VALUES (1, null, 5, 'Remove the hot dog and place on the bun. Top with your favorite condiments. Enjoy!' )


-- SELECT * FROM dbo.Ingredients

-- SELECT * FROM dbo.Recipes

-- SELECT * FROM Instructions
var getRandomDrinkContainer = document.getElementById('randomDrinkResult');

$('.glassItem').on('click', function (e) {

    console.log("****", e.target.id);
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=' + e.target.id + '_glass' || +e.target.id)
        .then(res => res.json())
        .then(res => {
            if (res.drinks.length > 0) {
                console.log(res.drinks[0].idDrink)
                fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' +
                    res.drinks[Math.floor(Math.random() * res.drinks.length)].idDrink)
                    .then(res2 => {
                        console.log(res2)
                        return res2.json()
                    })
                    .then(res2 => {
                        if (res2.drinks.length > 0) {
                            createRandomDrink(res2.drinks[Math.floor(Math.random() * res2.drinks.length)]);
                        }
                        createRandomDrink(res2.drinks[Math.floor(Math.random() * res2.drinks.length)]);
                    });

            }
        });

});


var createRandomDrink = (drinks) => {
    $('randomDrinkResult').empty();
    var ingredients = [];
    // Get all ingredients from the object. Up to 15
    for (let i = 1; i <= 15; i++) {
        if (drinks[`strIngredient${i}`]) {
            ingredients.push(`${drinks[`strIngredient${i}`]} - ${drinks[`strMeasure${i}`]}`)
        } else {
            // Stop if no more ingredients
            break;
        }
        // $('.ui.modal').modal('show');
        // console.log('Previous modal content has been cleared.');
        document.getElementById("homePage").style.display = "block";
        document.getElementById("foodPage").style.display = "none";
        document.getElementById("drinkPage").style.display = "none";
        document.getElementById("userPage").style.display = "none";
        //document.getElementById("headingStyle").style.display = "none";
        // document.getElementById("moodText").style.display = "none";
        // document.getElementById("glassContainer").style.display = "none";
    }
        console.log('Program has arrived at the start of card creation');
            //2. Empty container
        $('#randomDrinkResult').empty();

        //  Build the recipe card using retrieved data
        //  Retrieve the drink title
        var mainDrinkContainer = $('<div>').attr('class', 'sixteen wide column');
        mainDrinkContainer.appendTo('#randomDrinkResult');
        var currentDrinkTitle = $('<h2>').text(drinks.strDrink);
        currentDrinkTitle.appendTo(mainDrinkContainer);
        var drinkStarIcon = $("<i>").attr("class", "right floated star icon");
            drinkStarIcon.click(function(){
                drinkStarIcon.attr("class", "orange right floated star icon");
                //create an object to push to Local Storage
                //ingredients array
                var storedIngredients = [];
                for (var i = 0; i < ingredients.length; i++) {
                    var thisIngredient = drinks['strIngredient' + i];
                    var thisMeasurement = drinks['strMeasure' + i];
                    if (thisIngredient === null || thisIngredient === '' ) {
                        break;
                      } else if (thisMeasurement === null) {
                        storedIngredients.push(thisIngredient);
                        console.log('This ingredient without measure ' + i + ' = ', thisIngredient);
                      } else {
                        var combinedStoredIngredient = (thisMeasurement + ' ' + thisIngredient);
                        storedIngredients.push(combinedStoredIngredient);
                        console.log('This ingredient + measure ' + i + ' = ', combinedStoredIngredient)
                      }
                };

                var thisObject = {
                    'name': drinks.strDrink,
                    'pic': drinks.strDrinkThumb,
                    'ingredients': storedIngredients,
                    'directions': (drinks.strInstructions).split('\r\n')
                }

                console.log('This is the random object', thisObject);
                
                myStoredDrinks = JSON.parse(localStorage.getItem('savedDrinks')) || [];
                console.log('myStoredDrinks outside the for loop to check duplicates = ', myStoredDrinks);
                var saveDrink = true;
                    for (var i = 0; i < myStoredDrinks.length; i++){
                        console.log('myStoredDrinks.name = ', myStoredDrinks.name);
                        console.log('thisObject.name = ', thisObject.name); 
                        if(myStoredDrinks[i].name == thisObject.name){
                            console.log('This drink has already been saved. Do not add to localStorage.')
                            saveDrink = false;
                        } else { 
                            console.log('Inside else statement. No match yet, i = ', i , '. myStoredDrinks.length = ', myStoredDrinks.length);
                        }
                    }
                    if(saveDrink === true){
                        myStoredDrinks.push(thisObject);

                        localStorage.setItem('savedDrinks', JSON.stringify(myStoredDrinks));
                        console.log('The drink has been added to local storage.');
                        console.log('The object that was added is: ', thisObject);
                        console.log('myStoredDrinks = ', myStoredDrinks);
                    }
            })
            drinkStarIcon.appendTo(currentDrinkTitle);
        //  Retrieve the drink photo
        var currentDrinkImage = $('<img>').attr({ src: drinks.strDrinkThumb, class: 'ui rounded image' });
        currentDrinkImage.appendTo(mainDrinkContainer);
        //  Retrieve the drink directions
        //  Ingredients retrieval part 1: Cycle through ingredients array and create ingredient list  
        var thisDrinkIngredientList = $("<div>").text(thisDrinkIngredientContent).addClass("ui celled unordered list");
        thisDrinkIngredientList.appendTo('#randomDrinkResult');
        for (var i = 0; i < ingredients.length; i++) {
            var thisDrinkIngredientContent = ingredients[i];
                console.log('The ingredient ' + i + ' = ' + thisDrinkIngredientContent);
            //Ingredients retrieval Part 2: For each looped ingredient, create and append an ingredient row.
            var thisDrinkIngredientRow = $("<div>").text(thisDrinkIngredientContent).addClass("item");
            thisDrinkIngredientRow.appendTo(thisDrinkIngredientList);
            console.log('Drink ingredient ' + i + ' was added to the list.');
        };
        //6. Append the directions container to the page
        var thisDrinkDirectionsContainer = $('<p>').text(drinks.strInstructions);
        thisDrinkDirectionsContainer.appendTo('#randomDrinkResult');

        //7. Add button to clear randomDrinkResults container
        var clearButtonDiv = $('<div>').attr('class', 'actions');
        clearButtonDiv.appendTo('#randomDrinkResult');
        var clearButton = $('<button>').attr('class', 'ui pink basic button').text('Clear');
        clearButton.click(function(){
            $('#randomDrinkResult').empty();
        });
        clearButton.appendTo(clearButtonDiv);
            console.log('Program has arrived at the end of card creation');

}

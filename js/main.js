//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM

document.addEventListener("DOMContentLoaded", cocktailCarousel)
document.querySelector('button').addEventListener('click', getDrink)
document.querySelector('.recipe-link').addEventListener('click', displayRecipe)



let drinkID 

function getDrink(){
    stopCarousel()
    let drink = document.querySelector('input').value
    let drinkCard = document.querySelectorAll('.card')
    drinkCard.forEach(card => card.remove())

//comment out input
fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
//fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data.drinks)
      document.querySelector('.carousel-container').style.display = 'none'
      document.querySelector('.results-container').style.display = 'flex'
      let drinks = data.drinks
      for(let i = 0; i < drinks.length; i++){
        let container = document.querySelector('.results-container')
        let card = document.createElement('div')
        let img = document.createElement('img')
        let content = document.createElement('div')
        let p = document.createElement('p')
        let h2 = document.createElement('h2')
        //add classes
        card.classList.add('card', 'recipe-link')
        card.id = `${data.drinks[i].idDrink}`
        img.classList.add('result-img', `result-img-${i}`)
        //this is broken but you get the ida
        content.classList.add('result-content')
        p.classList.add('category', `category-${i}`)
        h2.classList.add('result-name', `result-name${i}`)
        //put them in place
        content.appendChild(p)
        content.appendChild(h2)
        card.appendChild(img)
        card.appendChild(content)
        container.appendChild(card)
        //fills in newly created content
        document.querySelector(`.result-name${i}`).innerText = data.drinks[i].strDrink
        document.querySelector(`.result-img-${i}`).src = data.drinks[i].strDrinkThumb
        document.querySelector(`.category-${i}`).innerHTML = data.drinks[i].strIBA != null ? data.drinks[i].strIBA : data.drinks[i].strCategory
        document.getElementById(`${data.drinks[i].idDrink}`).addEventListener('click', (x) => {
            if(!x.target.parentNode.id){
                drinkID = x.target.parentNode.parentNode.id
            }else{
                drinkID = x.target.parentNode.id
            }
        console.log('drink ID is '+ drinkID)  
        })
        document.getElementById(`${data.drinks[i].idDrink}`).addEventListener('click', displayRecipe)
      }
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

}


function cocktailCarousel(){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      //console.log(data.drinks[0].idDrink)
      drinkID = data.drinks[0].idDrink
      console.log('the carosel ID is '+drinkID) 
      //console.log(drinkID)
      document.querySelector('h2').innerText = data.drinks[0].strDrink
      document.querySelector('.carousel').src = data.drinks[0].strDrinkThumb
      

    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

const runCarousel = setInterval(cocktailCarousel, 5000)

function stopCarousel(){
    clearInterval(runCarousel)
}


function displayRecipe(){
    stopCarousel()
    document.querySelector('.recipe-container').style.display = 'flex'
    let ingredients = document.querySelectorAll('.ingredient-list')
    ingredients.forEach(ingredient => ingredient.remove())

    console.log('the drink ID being used is '+drinkID)
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      //console.log(data.drinks[0])
      document.querySelector('.drink-name').innerText = data.drinks[0].strDrink
      document.querySelector('.recipe-img').src = data.drinks[0].strDrinkThumb
      document.querySelector('.directions').innerText = data.drinks[0].strInstructions

      // add ingredients 
      for (let i = 1; i <= 15; i++){
        if(data.drinks[0][`strIngredient${i}`] != null){
            //console.log(data.drinks[0][`strIngredient${i}`])
            const li = document.createElement('li')
            li.classList.add('ingredient-list')
            li.textContent = (data.drinks[0][`strMeasure${i}`] != null ? data.drinks[0][`strMeasure${i}`] : '') + ' ' + data.drinks[0][`strIngredient${i}`]
            document.querySelector('.ingredients-list').appendChild(li)
        }else{
            break
        }
      }

    })
    .catch(err => {
        console.log(`error ${err}`)
    });

}

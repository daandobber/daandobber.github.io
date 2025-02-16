---
title: "Aantal tegels in Carcassonne oefenen"
description: "Een eenvoudige tool om de tegelverdeling van Carcassonne te oefenen. Gemaakt als een interactieve quiz met Astro, waarin tegels willekeurig worden getoond en het aantal moet worden geraden."
publishDate: "16 Jan 2025"
tags: ["carcassonne", "astro", "programmeren"]
---

## Beter worden in Carcassonne: een nieuwe tool op mijn site

Vorig jaar heb ik meegedaan aan het NK Carcassonne en ik eindigde op de zesde plaats. Om mijn spel te verbeteren, wil ik tegels beter kunnen tellen. Ik weet eigenlijk nooit precies hoeveel van elk er in het basisspel zitten.

Om mezelf (en anderen) te helpen, heb ik een oefening gemaakt die je op mijn website kunt spelen. Het concept is simpel: je krijgt een afbeelding van een tegel te zien en moet invoeren hoeveel keer deze in het basisspel voorkomt.

De oefening is gebouwd als een kleine module binnen Astro. Astro is een modern framework voor statische websites. Hoewel het op het eerste gezicht een eenvoudige webpagina lijkt, bevat het een dynamisch script dat willekeurige tegels toont, je antwoord controleert en een score bijhoudt.

[Oefen hier](/carcassonnequiz)

Alle tegelafbeeldingen komen van [Wikicarpedia](https://wikicarpedia.com/).

De code:

```html
---
---
<style>
  #tegel-image {
    max-width: 200px;
    display: block;
    margin-bottom: 1em;
  }
  #quiz-container, #results {
    margin: 1em 0;
  }
  #results {
    display: none;
  }
  table {
    border-collapse: collapse;
  }
  table, th, td {
    border: 1px solid #ccc;
    padding: 8px;
  }
  .correct {
    color: green;
  }
  .incorrect {
    color: red;
  }
</style>

<div id="quiz-wrapper">
  <h2>Carcassonne Quiz</h2>
  <div id="quiz-container">
    <img id="tegel-image" src="" alt="Tegel">
    <input type="number" id="aantal" placeholder="Aantal">
    <button id="actieKnop">Antwoorden</button>
    <p id="feedback"></p>
  </div>

  <div id="results">
    <h3>Resultaat</h3>
    <table>
      <thead>
        <tr>
          <th>Tegel</th>
          <th>Jouw antwoord</th>
          <th>Juiste antwoord</th>
          <th>Resultaat</th>
        </tr>
      </thead>
      <tbody id="results-table-body"></tbody>
    </table>
    <p id="total-result"></p>
  </div>
</div>

<script type="module">
  const tiles = [
      { image: '/carcassonnequiz/01-ffrf-02-c.png', count: 2 },
      { image: '/carcassonnequiz/02-ffff-04-c.png', count: 4 },
      { image: '/carcassonnequiz/03-cccc-01-s.png', count: 1 },
      { image: '/carcassonnequiz/04-crfr-04.png',   count: 4 },
      { image: '/carcassonnequiz/05-cfff-05.png',   count: 5 },
      { image: '/carcassonnequiz/06-fcfc-02-s.png', count: 2 },
      { image: '/carcassonnequiz/07-fcfc-01.png',   count: 1 },
      { image: '/carcassonnequiz/08-cfcf-03.png',   count: 3 },
      { image: '/carcassonnequiz/09-cffc-02.png',   count: 2 },
      { image: '/carcassonnequiz/10-crrf-03.png',   count: 3 },
      { image: '/carcassonnequiz/11-cfrr-03.png',   count: 3 },
      { image: '/carcassonnequiz/12-crrr-03.png',   count: 3 },
      { image: '/carcassonnequiz/13-ccff-02-s.png', count: 2 },
      { image: '/carcassonnequiz/14-ccff-03.png',   count: 3 },
      { image: '/carcassonnequiz/15-crrc-02-s.png', count: 2 },
      { image: '/carcassonnequiz/16-crrc-03.png',   count: 3 },
      { image: '/carcassonnequiz/17-ccfc-01-s.png', count: 1 },
      { image: '/carcassonnequiz/18-ccfc-03.png',   count: 3 },
      { image: '/carcassonnequiz/19-ccrc-02-s.png', count: 2 },
      { image: '/carcassonnequiz/20-ccrc-01.png',   count: 1 },
      { image: '/carcassonnequiz/21-rfrf-08.png',   count: 8 },
      { image: '/carcassonnequiz/22-ffrr-09.png',   count: 9 },
      { image: '/carcassonnequiz/23-frrr-04.png',   count: 4 },
      { image: '/carcassonnequiz/24-ffff-01.png',   count: 1 }
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let currentIndex = 0;
  let hasChecked = false;
  const results = [];

  function loadTile() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('results');

    if (currentIndex >= tiles.length) {
      quizContainer.style.display = 'none';
      showResults();
      return;
    }

    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';

    const tile = tiles[currentIndex];
    document.getElementById('tegel-image').src = tile.image;
    document.getElementById('feedback').textContent = '';
    document.getElementById('aantal').value = '';

    const button = document.getElementById('actieKnop');
    button.textContent = 'Antwoorden';
    hasChecked = false;
  }

  function nextOrCheck() {
    const feedback = document.getElementById('feedback');
    const userAnswer = parseInt(document.getElementById('aantal').value, 10);
    const tile = tiles[currentIndex];
    const button = document.getElementById('actieKnop');

    if (!hasChecked) {
      if (isNaN(userAnswer)) {
        feedback.textContent = 'Vul een getal in.';
        return;
      }

      feedback.textContent = userAnswer === tile.count
        ? 'Goed!'
        : 'Fout! Het juiste aantal is: ' + tile.count;

      results.push({
        image: tile.image,
        correctAnswer: tile.count,
        userAnswer: userAnswer,
        isCorrect: userAnswer === tile.count
      });

      hasChecked = true;
      button.textContent = 'Volgende';
    } else {
      currentIndex++;
      loadTile();
    }
  }

  function showResults() {
    const resultContainer = document.getElementById('results');
    resultContainer.style.display = 'block';

    const tableBody = document.getElementById('results-table-body');
    tableBody.innerHTML = '';

    let goodCount = 0;
    results.forEach((item) => {
      if (item.isCorrect) goodCount++;

      const row = document.createElement('tr');

      const imgCell = document.createElement('td');
      const imgElement = document.createElement('img');
      imgElement.src = item.image;
      imgElement.style.maxWidth = '60px';
      imgElement.alt = 'Tegel';
      imgCell.appendChild(imgElement);
      row.appendChild(imgCell);

      const userAnswerCell = document.createElement('td');
      userAnswerCell.textContent = item.userAnswer;
      row.appendChild(userAnswerCell);

      const correctAnswerCell = document.createElement('td');
      correctAnswerCell.textContent = item.correctAnswer;
      row.appendChild(correctAnswerCell);

      const resultCell = document.createElement('td');
      resultCell.textContent = item.isCorrect ? '✓' : '✗';
      resultCell.classList.add(item.isCorrect ? 'correct' : 'incorrect');
      row.appendChild(resultCell);

      tableBody.appendChild(row);
    });

    document.getElementById('total-result').textContent =
      `Je had ${goodCount} van de ${results.length} goed.`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    shuffle(tiles);
    loadTile();
    document.getElementById('actieKnop').addEventListener('click', nextOrCheck);
    document.getElementById('aantal').addEventListener('keydown', (event) => {
     if (event.key === 'Enter') {
       nextOrCheck();
    }
  });
});
</script>
```

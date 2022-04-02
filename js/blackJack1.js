const hitBtn = document.getElementById('blackJack-hit-btn')
const standBtn = document.getElementById('blackJack-stand-btn')
const dealBtn = document.getElementById('blackJack-deal-btn')

//dictionaries
let blackJackGame = {
  you: {
    scoreSpan: '#your-blackJack-result',
    div: '#your-box .cards',
    score: 0,
  },
  dealer: {
    scoreSpan: '#dealer-blackJack-result',
    div: '#dealer-box .cards',
    score: 0,
  },
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    K: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
  standClicked: 0,
}

const YOU = blackJackGame['you']
const DEALER = blackJackGame['dealer']

//sounds
const hitSound = new Audio('./sounds/swish.m4a')
const winSound = new Audio('./sounds/cash.mp3')
const lostSound = new Audio('./sounds/aww.mp3')

let randomImages = []

const updateScore = (card, active_player) => {
  if (card === 'A') {
    if (active_player['score'] + blackJackGame['cardsMap'][card][1] <= 21)
      active_player['score'] += Number(blackJackGame['cardsMap'][card][1])
    else active_player['score'] += Number(blackJackGame['cardsMap'][card][0])
  } else active_player['score'] += Number(blackJackGame['cardsMap'][card])

  document.querySelector(active_player['scoreSpan']).textContent =
    active_player['score'] > 21 ? 'BUST!' : active_player['score']
  document.querySelector(active_player['scoreSpan']).style.color =
    active_player['score'] > 21 ? 'red' : 'rgb(123, 190, 190)'
}

const showCard = (active_player) => {
  if (active_player['score'] <= 21) {
    let cardImage = document.createElement('img')
    let randomNum = Math.floor(Math.random() * 13)
    //getting unique cards
    if (randomImages.length >= blackJackGame['cards'].length) {
      alert('card limit exceeded')
      return
    }
    while (randomImages.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * 13)
    }
    randomImages.push(randomNum)

    cardImage.src = `./images/${blackJackGame['cards'][randomNum]}.png`
    document.querySelector(active_player['div']).appendChild(cardImage)

    updateScore(blackJackGame['cards'][randomNum], active_player)
    hitSound.play()
  } else {
    document.querySelector(active_player['scoreSpan']).textContent = 'BUST!'
  }
}

const blackJackHit = (_) => {
  if (blackJackGame['isStand'] === false) {
    showCard(YOU)
  }
}

const blackJackDeal = () => {
  if (blackJackGame['turnsOver'] === true) {
    blackJackGame['isStand'] = false

    const removeImages = (container) => {
      const images = document.querySelector(container).querySelectorAll('img')
      images.forEach((image) => image.remove())
    }
    removeImages(YOU['div'])
    removeImages(DEALER['div'])
    randomImages = []
    fixScore(YOU)
    fixScore(DEALER)
    document.querySelector('#blackJack-result').textContent = `Let's Play`
    document.querySelector('#blackJack-result').style.color = 'black'

    blackJackGame['turnsOver'] = false
    blackJackGame['standClicked'] = 0
  }
}

function fixScore(player) {
  player['score'] = 0
  document.querySelector(player['scoreSpan']).textContent = 0
  document.querySelector(player['scoreSpan']).style.color = 'rgb(123, 190, 190)'
}

//greate thing to sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function dealerLogic() {
  blackJackGame['isStand'] = true
  while (DEALER['score'] < 16 && blackJackGame['isStand'] === true) {
    showCard(DEALER)
    await sleep(800)
  }

  blackJackGame['turnsOver'] = true
  blackJackGame['standClicked']++
  if (blackJackGame['standClicked'] === 1) showResult(computeWinner())
}

//compute winner and looser\
//update wins,draws,looses
function computeWinner() {
  let winner
  let draw = false
  if (YOU['score'] <= 21) {
    if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
      winner = YOU
    } else if (YOU['score'] < DEALER['score']) {
      winner = DEALER
    } else if (YOU['score'] === DEALER['score']) {
      draw = true
    }
  } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    winner = DEALER
  } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    draw = true
  }

  return winner
}

function showResult(winner) {
  let message, messageColor
  if (blackJackGame['turnsOver'] === true) {
    if (winner === YOU) {
      blackJackGame['wins']++
      message = 'You Won!'
      messageColor = 'green'
      document.querySelector('#wins').textContent = blackJackGame['wins']
      winSound.play()
    } else if (winner === DEALER) {
      blackJackGame['losses']++
      message = 'You Lost'
      messageColor = 'red'
      document.querySelector('#losses').textContent = blackJackGame['losses']
      lostSound.play()
    } else {
      blackJackGame['draws']++
      message = 'You drew'
      messageColor = 'black'
      document.querySelector('#draws').textContent = blackJackGame['draws']
    }
    document.querySelector('#blackJack-result').textContent = message
    document.querySelector('#blackJack-result').style.color = messageColor
  }
}

hitBtn.addEventListener('click', blackJackHit)
dealBtn.addEventListener('click', blackJackDeal)
standBtn.addEventListener('click', dealerLogic)

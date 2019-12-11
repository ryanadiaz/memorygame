let imgArr = [];  // Empty array to hold the image paths for later

$(imgArr).each(function(key) {  // 
  var image = $('<img id="image-' + key + '" />').attr('src', this).css('display', 'none');
  $('.wrapper').append(image);
});

$.merge(cards, cards); // Make 2 of each card inside the cards object

// Declare variables
let click = false;
let pickComplete = false;
let redCounter = 0;
let blueCounter = 0;
let redTurn = true;
let blueTurn = false;

function shuffle() { // Randomize the cards object
  let keys = Object.keys(cards);
  keys.sort(function(a, b) {
    return Math.random() - 0.5;
  });
  return keys;
}

shuffle().forEach(function(key) { // Display cards in a randomized order
  $('#cards').append('<section class="card-container"> <div class="card-block flipped" data-id="' + cards[key].id + '"> <div class="card-front"> <img src="assets/images/union.png"> </div> <div class="card-back">' + '<img src="' + cards[key].image + '"> </div> </div> </section>');
});

function reset() { // Return the click trackers to original state
  clickOne = '';
  clickTwo = '';
  click = false;
  pickComplete = false;
}

var counter = 3;
var interval = setInterval(function() {
    counter--;
    $('#timer').text(counter);
    if (counter == 0) {
      clearInterval(interval);
      $('#timer, #starting').text('').hide();
      $('.card-block').each(function(i, obj){  
        $(this).toggleClass('flipped');
      });
    }
}, 1000);

console.log("It's red's turn!"); // Red team starts first
$('#redTeam').addClass('redsTurn');
$('#blueTeam').removeClass('bluesTurn');

$('.card-block').on('click', function() {
  if (!pickComplete) { // If no cards have been selected yet, then continue
    $(this).toggleClass('flipped');

    if (redTurn) {
      $('#redTeam').addClass('redsTurn');
      $('#blueTeam').removeClass('bluesTurn');

      if (!click) { // If this is the first selection, clickOne holds that card's id
        clickOne = $(this);
        clickOne.addClass('selected').addClass('unmatched');
        click = true;
      } else { // If this is the second selection, clickTwo holds that card's id
        clickTwo = $(this)
        clickTwo.addClass('selected').addClass('unmatched');
        pickComplete = true;

        if (clickOne.attr('data-id') == clickTwo.attr('data-id')) { // If both selections are a match
          clickOne.addClass('redWin').addClass('matched').removeClass('unmatched');
          clickTwo.addClass('redWin').addClass('matched').removeClass('unmatched');

          redCounter++;
          $('#redPoints').text(redCounter);
          console.log('You win! Go again.');
          reset();
        } else {
          console.log('Not a match!');
          setTimeout(function() { // Waits 1.5secs then flips both cards back over and resets for the other team
            $('.selected.unmatched').toggleClass('flipped').removeClass('selected');
            $('#redTeam').removeClass('redsTurn');
            $('#blueTeam').addClass('bluesTurn');
            console.log("It's blue's turn!");
            redTurn = false;
            blueTurn = true;
            reset();
          }, 1500);
        }
      }
    } else {
      console.log("It's blue's turn");

      if (!click) { // If this is the first selection, clickOne holds that card's id
        clickOne = $(this);
        clickOne.addClass('selected').addClass('unmatched');
        click = true;
      } else { // If this is the second selection, clickTwo holds that card's id
        clickTwo = $(this)
        clickTwo.addClass('selected').addClass('unmatched');
        pickComplete = true;

        if (clickOne.attr('data-id') == clickTwo.attr('data-id')) { // If both selects are a match
          clickOne.addClass('blueWin').addClass('matched').removeClass('unmatched');
          clickTwo.addClass('blueWin').addClass('matched').removeClass('unmatched');
          blueCounter++;
          $('#bluePoints').text(blueCounter);
          console.log('You win! Go again.');
          reset();
        } else {
          console.log('Not a match!');
          setTimeout(function() { // Waits 700ms then flips both cards back over and resets for the other team
            $('.selected.unmatched').toggleClass('flipped').removeClass('selected');
            $('#redTeam').addClass('redsTurn');
            $('#blueTeam').removeClass('bluesTurn');
            console.log("It's red's turn!");
            redTurn = true;
            blueTurn = false;
            reset();
          }, 700);
        }
      }
    }

    console.log("Red Score: " + redCounter);
    console.log("Blue Score: " + blueCounter);

    if (redCounter >= (cards.length / 2) / 2 + 1 || blueCounter >= (cards.length / 2) / 2 + 1 || (redCounter + blueCounter) == cards.length) { // First player to 11 points wins, otherwise it's a tie at 10 vs 10
      if (redCounter >= (cards.length / 2) / 2 + 1) { // Red wins
        $('.modal-header').addClass('red-background');
        $('#winner').text('Red Wins!');
      }

      if (blueCounter >= (cards.length / 2) / 2 + 1) { // Blue wins
        $('.modal-header').addClass('blue-background');
        $('#winner').text('Blue Wins!');
      }

      if ((redCounter + blueCounter) == cards.length) { // Tie game
        $('#winner').text("It's a tie!");
      }

      $('#gameoverModal').modal('show');
    }
  }
});
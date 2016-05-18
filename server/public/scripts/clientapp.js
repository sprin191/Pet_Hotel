$(document).ready(function () {
  getOwners();

  // add a movie
  $('#ownerSubmit').on('click', postOwner);
  //$('#petSubmit').on('click', postPet);


  // event listeners for Movies list
////  $('#movieList').on('click', '.update', putMovie);
  //$('#movieList').on('click', '.delete', deleteMovie);
});

/**-------- UTILITY FUNCTIONS --------**/
function dataPrep(button) {
  // get the movie data
  var movie = {};
  console.log(button.parent().children());
  console.log(button.parent().children().serializeArray());
  $.each(button.parent().children().serializeArray(), function (i, field) {
    movie[field.name] = field.value;
  });

  console.log('dataPrep', movie);

  return movie;
}

function getMovieId(button) {
  // get the movie ID
  var movieId = button.parent().data('movieId');
  console.log('getMovieId', movieId);
  return movieId;
}

/**-------- AJAX FUNCTIONS --------**/
function putMovie(event) {
  event.preventDefault();

  var preparedData = dataPrep($(this));
  var movieId = getMovieId($(this));

  $.ajax({
    type: 'PUT',
    url: '/movies/' + movieId,
    data: preparedData,
    success: function (data) {
      getMovies();
    },
  });
}

function deleteMovie(event) {
  event.preventDefault();

  var movieId = getMovieId($(this));

  $.ajax({
    type: 'DELETE',
    url: '/movies/' + movieId,
    success: function (data) {
      getMovies();
    },
  });
}

//gets owners info from database
function getOwners() {
  $.ajax({
    type: 'GET',
    url: '/owners',
    success: function (owners) {
      console.log(owners);
owners.forEach(function (owners) {
      $('#owners').append('<option value="' + owners.id + '">' + owners.first_name + ' ' + owners.last_name + '</option>');
       });
      // movies.forEach(function (movie) {
      //   $container = $('<div></div>');
      //
      //   // fields I want to edit
      //   var movieProperties = ['title', 'year', 'director'];
      //   movieProperties.forEach(function (prop) {
      //     var $el = $('<input type="text" id="' + prop + '" name="' + prop + '" />');
      //     $el.val(movie[prop]);
      //     $container.append($el);
      //   });
      //
      //   $container.data('movieId', movie.movie_id);
      //   $container.append('<button class="update">Update</button>');
      //   $container.append('<button class="delete">Delete</button>');
      //   $('#movieList').append($container);
      // });
    },
  });
}
/*function getPets() {
  $.ajax({
    type: 'GET',
    url: '/movies',
    success: function (movies) {
      console.log(movies);
      $('#movieList').empty();
      movies.forEach(function (movie) {
        $container = $('<div></div>');

        // fields I want to edit
        var movieProperties = ['title', 'year', 'director'];
        movieProperties.forEach(function (prop) {
          var $el = $('<input type="text" id="' + prop + '" name="' + prop + '" />');
          $el.val(movie[prop]);
          $container.append($el);
        });

        $container.data('movieId', movie.movie_id);
        $container.append('<button class="update">Update</button>');
        $container.append('<button class="delete">Delete</button>');
        $('#movieList').append($container);
      });
    },
  });
}*/

function postOwner(event) {
  event.preventDefault();

  var owner = {};
  //gathers the data from the form for owners
  $.each($('#ownerForm').serializeArray(), function (i, field) {
    owner[field.name] = field.value;
  });
      console.log(owner);

  //sends the owner information to the server via POST
  $.ajax({
    type: 'POST',
    url: '/owners',
    data: owner,
    success: function (data) {
      console.log("pet success!");
      //getPets();
    },
  });
}

function postPet(event) {
  event.preventDefault();

  var pet = {};
  var ownerList = {};

  $.each($('#movieForm').serializeArray(), function (i, field) {
    movie[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/pets',
    data: pet,
    success: function (data) {
      getOwners();
    },
  });
}

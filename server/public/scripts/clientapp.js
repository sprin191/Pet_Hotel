$(document).ready(function () {
  getOwners();
  getPets();

  $('#ownerSubmit').on('click', postOwner);
  $('#petSubmit').on('click', postPet);
// event listeners
  $('#petStatus').on('click', '.update', putPet);
  $('#petStatus').on('click', '.delete', deletePet);

  $('#petStatus').on('click', '.checkInOut', postVisit);

});

/**-------- UTILITY FUNCTIONS --------**/
function dataPrep(button) {
  // get the pet data
  var pet = {};
  console.log(button.parent().children());
  console.log(button.parent().children().serializeArray());
  $.each(button.parent().children().serializeArray(), function (i, field) {
    pet[field.name] = field.value;
  });

  console.log('dataPrep', pet);

  return pet;
}

function getPetId(button) {
  // get the movie ID
  var petId = button.parent().data('petID');
  console.log('getPetId', petId);
  return petId;
}

/**-------- AJAX FUNCTIONS --------**/
function putPet(event) {
  event.preventDefault();

  var preparedData = dataPrep($(this));
  var petId = getPetId($(this));

  $.ajax({
    type: 'PUT',
    url: '/pets/' + petId,
    data: preparedData,
    success: function (data) {
      getPets();
    },
  });
}

function deletePet(event) {
  event.preventDefault();

  var petId = getPetId($(this));

  $.ajax({
    type: 'DELETE',
    url: '/pets/' + petId,
    success: function (data) {
      getPets();
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
      $('#owner').empty();
owners.forEach(function (owners) {
      $('#owner').append('<option value="' + owners.id + '">' + owners.first_name + ' ' + owners.last_name + '</option>');
       });


    },
  });
}
function getPets() {
  $.ajax({
    type: 'GET',
    url: '/pets',
    success: function (pets) {
      console.log(pets);
      $('#petStatus').empty();
      pets.forEach(function (pet) {
        $container = $('<div></div>');
        $container.append('<div class = "petOwner">' + pet['last_name'] + ', ' + pet['first_name'] + '</div>');
        // fields I want to edit
        var petProperties = ['name', 'breed', 'color'];
        petProperties.forEach(function (prop) {
          var $el = $('<input type="text" id="' + prop + '" name="' + prop + '" />');
          $el.val(pet[prop]);
          $container.append($el);
        });

         $container.data('petID', pet.id);
         $container.append('<button class="update">Update</button>');
         $container.append('<button class="delete">Delete</button>');
         $container.append('<button class="checkInOut">Check In</button>');
        $('#petStatus').append($container);
      });
    },
  });
}

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
      console.log("success!");
      getOwners();
    },
  });
}




function postVisit(event) {
  event.preventDefault();

var visit = {};
var petId = getPetId($(this));

if ($(this).text() === "Check In") {

  var checkInTime = new Date();
  var updatedTime = checkInTime.toISOString();

  visit = {'checkIn' : updatedTime, 'petID' : petId};
  $.ajax({
    type: 'POST',
    url: '/visits',
    data: visit,
    success: function (data) {
      //getPets();

    },
  });
  $(this).text("Check Out");
}
/*else {
  var checkOutTime = Date($.now());
  visit = {'checkOut' : checkOutTime, 'petID' : petId};
  $.ajax({
    type: 'POST',
    url: '/visits',
    data: visit,
    success: function (data) {
      //getPets();
    },
  });
  $(this).text("Check In");
}*/

}

function postPet(event) {
  event.preventDefault();

  var pet = {};
  var ownerList = {};

  $.each($('#petForm').serializeArray(), function (i, field) {
  pet[field.name] = field.value;
  });
  console.log(pet);

  $.ajax({
    type: 'POST',
    url: '/pets',
    data: pet,
    success: function (data) {
      getPets();
    },
  });
}

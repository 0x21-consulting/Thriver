if (Meteor.isClient) {
    //Register Form
    Template.register.events({
        'submit form': function(event){
            event.preventDefault();
            var nameVar = event.target.registerName.value;
            var providerVar = event.target.registerProvider.value;
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            console.log("Form submitted.");
        }
    });
    //Login Form
    Template.login.events({
        'submit form': function(event) {
            event.preventDefault();
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;
            console.log("Form submitted.");
        }
    });
}
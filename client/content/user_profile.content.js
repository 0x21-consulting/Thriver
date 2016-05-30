//Sidebar sections
var profileVars = [{
        title: 'Name',
        id: 'updateName',
        type: 'name',
        value: 'name',
        valueGlobal: 'true',
        required: 'required'
    },{ 
        title: 'Associated Organization',
        id: 'updateProvider',
        type: 'text',
        value: 'organization',
        valueGlobal: 'true', 
        disable: 'disable'   
    },{ 
        title: 'Email',
        id: 'updateEmail',
        type: 'email',
        value: 'email',
        valueGlobal: 'true',
        required: 'required'     
    },{ 
        title: 'Password',
        id: 'updatePassword',
        type: 'password',
        value: 'xxxxxx',
        required: 'required'  
    }
];

Template.profile.item = function() {
    return profileVars;
};
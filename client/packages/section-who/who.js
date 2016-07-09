// Subscriptions
People = new Mongo.Collection('people');
Meteor.subscribe('people');

Template.who.helpers({
    headline: "Who We Are",
    content: "<p>WCASA is a membership agency comprised of organizations and <br>individuals working to end sexual violence in Wisconsin. <br>WCASA is made up of it's staff, board, volunteers and <br> 51 sexual assault service provider agencies.</p>",
    items: [{
        class: 'left',
        tabs: [{
            title: 'About WCASA',
            icon: '&#xf018;',
            id: 'about',
            template : 'about'
        },{
            title: 'WCASA Philosophies',
            icon: '&#xf279;',
            id: 'philosophies',
            template : 'philosophies'
        },{
            title: 'WCASA Staff',
            icon: '&#xf0c0;',
            id: 'staff',
            template: 'staff'
        },{
            title: 'Board of Directors',
            icon: '&#xf0c0;',
            id: 'board',
            template: 'board'
        }]
    }]
});

Template.personStaff.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});
Template.personBoard.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});

Template.board.helpers({
    board: function () {
        return People.find({ boardMember: true }, { sort: { title: -1, name: 1 }});
    }
});

Template.staff.helpers({
    staff: function () {
        return People.find({ boardMember: false }, { sort: { name: 1 }});
    }
});


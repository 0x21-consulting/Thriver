Template.contact.helpers({
    heading: 'Contact WCASA',
    phone: '(608) 257-1516',
    email: 'wcasa@wcasa.org',
    fax: '(608) 257-2150',
    submitValue: 'Send Message',
    copyright: '2010-2016 Wisconsin Coalition Against Sexual Assault, Inc.',
    imgSrc: '/lib/img/wisconsin-coalition-against-sexual-assault.svg',
    imgAlt: 'Wisconsin Coalition Against Sexual Assault',
    addressL1: '2801 West Beltine Highway, Suite 202',
    addressL2: 'Madision, Wisconsin 53713',
    mapUrl: 'https://www.google.com/maps/place/2801+W+Beltline+Hwy+%23202,+Madison,+WI+53713/@43.034741,-89.4274008,17z/data=!3m1!4b1!4m2!3m1!1s0x8807ad6daf6daa9d:0x93cfebcf81dadf8a',
    items: [{
        title: 'Name',
        id: 'name',
        type: 'name',
        required: 'required',
        placeholder: 'Name'
    },{
        title: 'Email',
        id: 'email',
        type: 'email',
        required: 'required',
        placeholder: 'Email'
    }]
});

Template.contact.events({
    //'click #staff-list': function (event) {
    //    document.querySelector('[href="#staff"]').click();
    //}
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.contact.onRendered(function () {
    // Get db ID from current instance
    var instanceName = this.data.name;

    // Register
    Thriver.history.registry.insert({
        element: Thriver.sections.generateId(instanceName),
        /** Handle deep-linking */
        callback: function (path) {
            console.debug('Deep-link:', path);
        }
    });
});

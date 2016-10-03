/**
 * @summary Route for Action Alerts
 */
Router.route('action-alert', {
    path: '/action-alert/:title',
    layoutTemplate: 'post',
    /**
     * @summary Wait for subscription
     */
    waitOn: function () {
        return Meteor.subscribe('actionAlerts');
    },
    /**
     * @summary Data to pass to template
     */
    data: function () {
        if (!this.ready()) return;
        
        let alert = Thriver.newsroom.collection.findOne(
            { url: this.url.replace(/https?:\/{2,}.+?(:\d{,5})?\//i, '/') });
        
        // The Post template expects the following additional information:
        alert['category'] = 'Action Alert';
        alert['logos'] = [{
            title: 'WCASA',
            src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
            url: '/'
        }];

        return alert;
    },
    action: function () {
        if ( this.ready() ) this.render();
    }
});

/**
 * @summary Route for Press Releases
 */
Router.route('press-release', {
    path: '/press-release/:title',
    layoutTemplate: 'post',
    /**
     * @summary Wait for subscription
     */
    waitOn: function () {
        return Meteor.subscribe('pressReleases');
    },
    /**
     * @summary Data to pass to template
     */
    data: function () {
        if (!this.ready()) return;
        
        let alert,
            alerts = Thriver.newsroom.collection.find(
            { type: 'pressRelease' }).fetch();
        
        // Find the Newsroom item that matches the name
        for (let i = 0; i < alerts.length; ++i)
            if (Thriver.sections.generateId(alerts[i].title) === this.params.title) {
                alert = alerts[i];
                break;
            }
        
        // TODO: Item not found needed here
        if (!alert) return;
        
        // The Post template expects the following additional information:
        alert['category'] = 'Press Release';
        alert['logos'] = [{
            title: 'WCASA',
            src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
            url: '/'
        }];

        return alert;
    },
    action: function () {
        if ( this.ready() ) this.render();
    }
});

/**
 * @summary Display main canvas template by default
 */
Router.configure({
    layoutTemplate: 'canvas'
})

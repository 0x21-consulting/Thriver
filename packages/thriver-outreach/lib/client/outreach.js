Template.outreach.helpers({
	headline: "Get Involved",
	content: "<p>We believe that everyone has a role and a responsibility <br>in this work. WCASA is always seeking passionate folks<br>to join up and help make a difference.<br><button class='action-alert-link'>See Action Alerts <span class='fa'>&#xf0da;</span></button></p>",
	items: [{
		tabs: [{
				title: 'Volunteer',
				id: 'volunteer',
				template : 'volunteer'
			},{
				title: 'Join The Board',
				id: 'joinTheBoard',
				template : 'joinTheBoard'
			},{
				title: 'Jobs & Internships',
				id: 'wcasaJobs',
				template: 'wcasaJobs'
			}
		]
	}]
});

Template.volunteer.helpers({
    headline: "Volunteer with WCASA",
    content: "<p>Interested in volunteering with WCASA? All interested parties should contact Kathleen Brandenburg, Office Manager at (608) 257-1516 or <a href='mailto:wcasa@wcasa.org'>wcasa@wcasa.org.</a></p>",
    listHeadline: "Current Volunteering Opportunities",
    lists: [{
	    type: 'article', //accepts: generic, details, article
	    itemType: 'category',
	    style: 'striped',
	    categories: [{
	        title: 'Clerical',
	        id: 'jobA',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
	    },{
 	        title: 'Another Position',
	        id: 'jobB',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
        },{
 	        title: 'Yet Another Position',
	        id: 'jobC',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
        }]
	}]
});

Template.joinTheBoard.helpers({
    headline: "Join The Board",
    content: "<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat..</p>",
});

Template.wcasaJobs.helpers({
    headline: "WCASA Jobs",
    content: "<p>Interested in volunteering with WCASA? All interested parties should contact Kathleen Brandenburg, Office Manager at (608) 257-1516 or <a href='mailto:wcasa@wcasa.org'>wcasa@wcasa.org.</a></p>",
    listHeadline: "Find a Job at WCASA",
    lists: [{
	    type: 'article', //accepts: generic, details, article
	    itemType: 'category',
	    style: 'striped',
	    categories: [{
	        title: 'Clerical',
	        id: 'jobA',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
	    },{
 	        title: 'Another Position',
	        id: 'jobB',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
        },{
 	        title: 'Yet Another Position',
	        id: 'jobC',
	        items: [{
	            content: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p><p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>',
	        }]
        }]
	}]
});

Template.outreach.onRendered(function() {
	//This seems out of place
	$('.action-alert-link').click(function(){
		$("#utility a[href='#news']").trigger("click");
		$(".sidebar-content menu.tabs a[href='#action-alerts']").trigger("click");
	});
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.outreach.onRendered(function () {
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

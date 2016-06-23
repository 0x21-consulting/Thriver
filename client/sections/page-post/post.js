Template.post.helpers({
	home: {
		url: 'http://www.wcasa.org',
		text: 'Back to WCASA'
	},
	share : [{
		id: 'twitter',
		icon: '&#xf099;',
		url: 'https://twitter.com/intent/tweet?url=' + window.location.href + '&text=' + document.title
	},{
		id : 'facebook',
		icon: '&#xf082;',
		url: 'https://www.facebook.com/sharer/sharer.php?&u=' + window.location.href
	},{
		id: 'google',
		icon: '&#xf0d5;',
		url: 'https://plus.google.com/share?url=' + window.location.href
	},{
		id: 'print',
		icon: '&#xf02f;',
		print: 'print'
	}],
	data : {
		title: 'Bill Targets Transgendered Students',
		id: 'post1',
		category: 'news',
		logo: [{
			title: 'WCASA',
			src: '/lib/img/wisconsin-coalition-against-sexual-assault.png',
			url: 'http://www.wcasa.org'
		},{
			title: 'EDAW',
			src: '/lib/img/edaw.png',
			url: 'http://www.endabusewi.org/'
		}],
		content: ' <p>The purpose of this HTML is to accomodate all types of content entry by administrator. All of the containing content styles are applied to any parent element containing the class, "textBody".</p><hr> <h1>Heading 1</h1> <h2>Heading 2</h2> <h3>Heading 3</h3> <h4>Heading 4</h4> <h5>Heading 5</h5> <hr> <h2>Paragraph and Inline/Misc Elements – b, strong, img, map, object, sub, sup, cite, anchor, emphasis, bold, underline, blockquote.</h2> <p> Lorem ipsum dolor sit amet, <a href="#" title="test link">test link</a> adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus. </p><p> Lorem <sup>superscript</sup> dolor <sub>subscript</sub> amet, consectetuer adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. <cite>cite</cite>. Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, <a href="#">gravida vehicula</a>, nisl. Praesent mattis, <b>massa quis luctus</b> fermentum, <strong>turpis mi volutpat justo,</strong> eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. <em>Suspendisse quam sem</em>, consequat at, <u>commodo vitae</u>, feugiat in, nunc. Morbi imperdiet augue quis tellus. <img src="lib/img.jpg" alt=""/> Neu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus. </p><blockquote> <p> "An app in the making" <br>-Unknown </p></blockquote> <hr> <h2>List Types</h2> <h3>Definition List</h3> <dl> <dt>Definition List Title</dt> <dd>This is a definition list division.</dd> </dl> <h3>Ordered List</h3> <ol> <li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ol> <h3>Unordered List</h3> <ul> <li>List Item 1</li><li>List Item 2 <ul> <li>List inner a</li><li>List inner b</li><li>List inner c</li></ul> </li><li>List Item 3</li></ul> <hr> <h2>Forms</h2> <form> <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. </p><label for="text_field">Text Field:</label> <input type="text" id="text_field"> <label for="text_area">Text Area:</label> <textarea id="text_area"></textarea> <label for="select_element">Select Element:</label> <select name="select_element"> <option value="1">Option 1</option> <option value="2">Option 2</option> <option value="3">Option 3</option> </select> <h3>A selection</h3> <input id="radio1" type="radio" name="amount" value="25"/> <label for="radio1" class="radio">$25</label> <input id="radio2" type="radio" name="amount" value="50"/> <label for="radio2" class="radio">$50</label> <input id="radio3" type="radio" name="amount" value="100" checked/> <label for="radio3" class="radio">$100</label> <input id="radio4" type="radio" name="amount" value="200"/> <label for="radio4" class="radio">$200</label> <h3>Another Selection</h3> <input id="check1" type="checkbox" name="amount" value="25"/> <label for="check1">$25</label> <input id="check2" type="checkbox" name="amount" value="50"/> <label for="check2">$50</label> <input id="check3" type="checkbox" name="amount" value="75"/> <label for="check3">$75</label> <label for="file">File Input:</label> <input type="file" class="file" name="file"> <input class="button" type="reset" value="Clear"> <input class="button" type="submit" value="Submit"> </form> <hr> <h2>Tables</h2> <table> <tbody> <tr> <th>Table Header 1</th> <th>Table Header 2</th> <th>Table Header 3</th> </tr><tr> <td>Division 1</td><td>Division 2</td><td>Division 3</td></tr><tr> <td>Division 1</td><td>Division 2</td><td>Division 3</td></tr><tr> <td>Division 1</td><td>Division 2</td><td>Division 3</td></tr></tbody> </table>'
	},
	footer : {
		media : {
			title: 'Media Contacts',
			contact: [{
				name: 'Dominic Holt',
				org: 'WCASA',
				phone: '608-257-1516',
				phoneExt: '113',
				email: 'dominich@wcasa.org'
			},{
				name: 'Tony Gibart',
				org: 'EDAW',
				phone: '608-237-3452',
				email: 'tonyg@endabusewi.org'
			}]
		},
		about: [{
			content: '<p>End Domestic Abuse Wisconsin (<a href="www.endabusewi.org" target="_blank">www.endabusewi.org</a>) is the leading voice for victims of domestic abuse in Wisconsin. At End Domestic Abuse Wisconsin, we educate shelter and program volunteers and advocates, law enforcement, legislators, and community members to provide safety and support to survivors. We strive to shift Wisconsin from the attitudes and beliefs that cause domestic violence to values of mutual respect and equality, and we partner with communities in the effort to prevent and end domestic abuse.</p>'
		},{
			content: '<p>The Wisconsin Coalition Against Sexual Assault (WCASA, <a href="www.wcasa.org" target="_blank">www.wcasa.org</a>) is a membership agency comprised of organizations and individuals working to end sexual violence in Wisconsin. Among these are the 51 sexual assault service provider agencies throughout the state that offer support, advocacy and information to survivors of sexual assault and their families. WCASA works to ensure that every survivor in Wisconsin gets the support and care they need. WCASA also works to create the social change necessary to ensure a future where no child, woman or man is ever sexually violated again.</p>'
		}],
		social : [{
			id: 'twitter',
			icon: '&#xf099;',
			url: 'https://twitter.com/wcasa_org'
		},{
			id: 'facebook',
			icon: '&#xf082;',
			url: 'https://www.facebook.com/wcasa'
		},{
			id: 'youtube',
			icon: '&#xf16a;',
			url: 'https://www.youtube.com/user/WCASAVPCC'				
		}]

	}
});

//Fallback shares
//http://justmeteor.com/blog/implement-your-own-social-share-buttons/
//Will not work locally
/*UI.registerHelper('twitterShareLink', function() {
    return 'https://twitter.com/intent/tweet?url=' + window.location.href + '&text=' + document.title;
});

UI.registerHelper('facebookShareLink', function() {
    return 'https://www.facebook.com/sharer/sharer.php?&u=' + window.location.href;
});

UI.registerHelper('googlePlusShareLink', function() {
    return 'https://plus.google.com/share?url=' + window.location.href;
});*/
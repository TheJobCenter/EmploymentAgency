		workerURL = 'worker.php';
		t = [], sp = []; 
		translate = false;
		websiteAddress = window.location.protocol + '//' + window.location.host;
		websiteTitle = document.title.substring(0, document.title.indexOf('-')).trim();
		var userLanguage = window.navigator.language.substring(0,2);	// default web browser language
		var systemLang = document.documentElement.lang.substring(0,2);	// this websites default language
		var hl = new URLSearchParams(window.location.search.trim().toLowerCase());
		if (hl.get('hl') !== null) {	// override browser language
			userLanguage = hl.get('hl').substring(0,2); 
		}
		var postData = 'xfrom='+ systemLang + '&xto=' + userLanguage;
		var checkValidLang = /^[a-z]+$/;
		if(userLanguage.match(checkValidLang) && userLanguage !== systemLang) {
			$.ajax({type:'POST', url: workerURL, data: postData ,  async: false, 
				success: function(thisText){
					t = JSON.parse(thisText);
					translate = true;
				},
				error: function(someotherText) {
					alert('Translation error');
				}
			});
		}

	if($(document).ready()) {
		$('#hintFirst').click(function() {selectHint(this.id);})
		$('#hintSecond').click(function() {selectHint(this.id);})
		$('#hintThird').click(function() {selectHint(this.id);})
		$('#signinSVG').click(function() {showLogin(); })
		$('#signoutSVG').click(function() {hideLogin(); })
		var todaysDate = new Date().toISOString().slice(0,10);
		lastUpdated = $('#dateGrid').html();
		searchHint = $('#searchHint').html();
		if (translate) {
			$('#policyAUP').html(t.auptitle);
			$('#policyTOS').html(t.tostitle);
			$('#policyCookies').html(t.cookiestitle);
			$('#policyPrivacy').html(t.privacytitle);
			$('#policyGreen').html(t.greentitle);
			$('#policyDisclaim').html(t.disclaimtitle);
			$('#policyAbout').html(t.abouttitle);
			$('#searchHint').html(t.searchhint);
			$('#searchNothing').html(t.nothingfound);
			$('#searchFor').prop('placeholder',t.searchfor);
			$('#policyTopButton').html(t.policies);
			$('#signinTitle').html(t.signin);
			$('#signoutTitle').html(t.signout);
			$('#dateGrid').html(t.lastupdated + ': <span class="dateColor">' + todaysDate + '</span>');
		} else {
			$('#dateGrid').html(lastUpdated + ': <span class="dateColor">' + todaysDate + '</span>');
		}
	}
		hideHints();
		hideLogin();
		
		if (window.location.pathname.trim().toLowerCase().substring(0,1) === '/'){ 	// auto display policies aas though they're in a directory
		//	alert("subdirectory");
		}


		if (hl.has('q')) {
			getParams = 'hl=' + userLanguage + '&q=' + hl.get('q');
			getParams = getParams.replace(/%|;/g,' ');		// don't allow % or ; characters in url parameter
			$.ajax({type:'POST', url: workerURL, data: getParams ,  async: false, 
				success: function(thisText){
					//sp = JSON.parse(thisText); //Object.values(JSON.parse(
					//alert(sp[0].name);
					alert('thisText=' + thisText);
				},
				error: function(someotherText) {
					alert('error:' + someotherText);
					// do nothing, don't care !!
				}
			});
		}
		if(window.history.replaceState) {
			window.history.replaceState({}, null , websiteAddress);	// get rid of trailing search parameters to make it tidy !!
		}
			
		$('#searchform').submit(function(e) { // this does the Submit search
			e.preventDefault();
			if($('#hintFirst').html() != '') selectHint('hintFirst');

			var sf = $('#searchFor').val().trim();
			if(sf.indexOf(' ') != -1) sf=sf.split(' ').toString(); // convert from space seperated list to comma seperated list

			$.ajax({type:'POST', url: workerURL, data: 'f='+ sf, 
				success: function(thisText){
					var hints = JSON.parse(thisText);
					var showResults='';
					for(i=0;i<hints.length;i++){
						showResults = showResults + ' ' + hints[i].name;
					}
					hideHints();
					if(showResults != '') {
						document.title = websiteTitle + ' - ' + showResults; 
					} else {
						document.title = websiteTitle;
					}
				},
				error: function(thisText) {
					searchError();
					document.title = websiteTitle;
				}
			});

		});
	
		$('#searchFor').keyup( function(e) { // this does the auto-complete search
		
			if(e.key === ' ') {
				if($('#hintFirst').html() != '') selectHint('hintFirst');
			} 
			var typed = $(this).val();

			if(typed != '') {
				hideHints();
				var getLastWord = typed.split(' ');
				if(getLastWord[getLastWord.length-1].trim() != '') {
					$.ajax({type:"POST", url: workerURL, data: 's='+ getLastWord[getLastWord.length-1], 
						success: function(thisText){
							var hints = JSON.parse(thisText);
							if(hints.length) {
								if(hints.length>0) showHints('hintFirst',hints[0].name);
								if(hints.length>1) showHints('hintSecond',hints[1].name);
								if(hints.length>2) showHints('hintThird',hints[2].name);
							} else {
								searchError();
							}
						},
						error: function(thisText){
							searchError();
						}
					});
				}
				
			} else {
			
				hideHints();
				
			}

		});
		
		function selectHint(btnName) {
					
			var hint = $('#'+btnName).html();
			var searchForText = $('#searchFor').val();
			var searchFor = searchForText.split(' ');
			if(searchForText.slice(searchForText.length-1) === ' ') searchFor.pop();
			searchFor[searchFor.length-1]=hint;
			$('#searchFor').val(searchFor.join(' ')+' ').focus();
		
		}
		
	
		function searchError() {
		
			$('#searchHint').hide();
			$('#searchNothing').show();
			
		}
	
		function showHints(where,what) {
		
			$('#searchHint').hide();
			$('#searchNothing').hide();
			$('#'+where).show().html(what).prop('title',what);

		}
		
		function hideHints() {
		
			$('#hintFirst').hide().html('').prop('title','');
			$('#hintSecond').hide().html('').prop('title','');
			$('#hintThird').hide().html('').prop('title','');
			$('#searchNothing').hide();
			$('#searchHint').show();

		}
		
		function showPolicy(showWhat) {
		
			$('.policyDropdownList').hide();
			var pol = new Array(), postData = 'policy=' + showWhat + '&hl=' + userLanguage;
			$.ajax({type:'POST', url: workerURL, data: postData , 
				success: function(thisText){
					pol = JSON.parse(thisText);
			//		document.title = t.titlepolicypre + ' : ' + pol[0].displayname + ' ' + t.titlepolicypost;
					alert(pol[0].content);
					pol = Array(); 
				},
				error: function(someotherText) {
					alert('Could not find that policy in language "' + userLanguage + '"');
				}
			});
			$('.policyDropdownList').show();

		}
		
		function showLogin() {
			
			$('#signinSVG').hide();
			$('#signoutSVG').show();
			$('#loginForm').show();
			
		}

		function hideLogin() {
			
			$('#loginForm').hide();
			$('#signoutSVG').hide();
			$('#signinSVG').show();
		}
		
if (!navigator.userAgent.match(/bot|facebookexternalhit|google|ia_archiver|slurp|spider|yandex/i)) {	
	// if you're a search engine bot, don't bother with consent cookie screen

		var cookieOptions = {
			textPopup: 'We use cookies to ensure you have the best experience on our site. If you continue to use our site, we will assume that you agree to their use. For more information, please see our <a href="#">privacy policy</a>.',
			textAccept : 'Accept all',
			textConfigure : 'Configure choices',
			textSave : 'Save choices',
			switches: [
				{	text: 'Storing user sign in details',
					name: 'cookieUser',
					purpose: 'necessary'	// 'necessary' or 'functionality' or 'statistics' or 'marketing'
				},
				{
					text: 'Storing user preferences on this device',
					name: 'cookiePreferences',
					purpose: 'functionality'	// 'necessary' or 'functionality' or 'statistics' or 'marketing' 
				},
				{
					text: 'Allow access to location data',
					name: 'cookieLocation',
					purpose: 'statistics'	// 'necessary' or 'functionality' or 'statistics' or 'marketing'
				},
				{
					text: 'Allow 3rd party adverts and analysis',
					name: 'cookieAdvertising',
					purpose: 'marketing'	// 'necessary' or 'functionality' or 'statistics' or 'marketing'
				}
			]
		}
		popupConsent(cookieOptions);
}
		
		workerURL = 'worker.php';
		t = [], sp = []; 
		translate = false;
		passedHL = false;
		websiteAddress = window.location.protocol + '//' + window.location.host;
		websiteTitle = document.title.substring(0, document.title.indexOf('-')).trim();
		var userLanguage = window.navigator.language.substring(0,2);	// default web browser language
		var systemLang = document.documentElement.lang.substring(0,2);	// this websites default language
		var wls = new URLSearchParams(window.location.search.trim().toLowerCase());
		if (wls.get('hl') !== null) {	// override browser language
			userLanguage = wls.get('hl').substring(0,2); 
			passedHL = true;
		}
		var postData = 'xfrom='+ systemLang + '&xto=' + userLanguage;
		var checkValidLang = /^[a-z]+$/;
		if(userLanguage.match(checkValidLang)) { //  && userLanguage !== systemLang) {
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
/*
			$('#policyAUP').html(t.auptitle);
			$('#policyTOS').html(t.tostitle);
			$('#policyCookies').html(t.cookiestitle);
			$('#policyPrivacy').html(t.privacytitle);
			$('#policyGreen').html(t.greentitle);
			$('#policyDisclaim').html(t.disclaimtitle);
			$('#policyAbout').html(t.abouttitle); */
			$('#searchHint').html(t.searchhint);
			$('#searchNothing').html(t.nothingfound);
			$('#searchFor').prop('placeholder',t.searchfor);
			$('#labelJobs').html(t.labeljobs);
			$('#labelNews').html(t.labelnews);
			$('#labelContact').html(t.labelcontact);
			$('#labelPolicies').html(t.labelpolicies);
			$('#signinTitle').html(t.signin);
			$('#signoutTitle').html(t.signout);
//			$('#dateGrid').html(t.lastupdated + ': <span class="dateColor">' + todaysDate + '</span>');
		} else {
//			$('#dateGrid').html(lastUpdated + ': <span class="dateColor">' + todaysDate + '</span>');
		}
	}
		hideHints();
		hideLogin();

			

		if (wls.has('q')) {
			getParams = 'hl=' + userLanguage + '&q=' + wls.get('q');
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
		} else {

			if (wls.get(t.aupcode) != null) { showPolicy(t.aupcode);}
			if (wls.get(t.toscode) != null) { showPolicy(t.toscode);}
			if (wls.get(t.cookiecode) != null) { showPolicy(t.cookiecode);}
			if (wls.get(t.privacycode) != null) { showPolicy(t.privacycode);}
			if (wls.get(t.greencode) != null) { showPolicy(t.greencode);}
			if (wls.get(t.disclaimcode) != null) { showPolicy(t.disclaimcode);}
			if (wls.get(t.contactcode) != null) { showPolicy(t.contactcode);}
			
		}
		if(window.history.replaceState) {
			window.history.replaceState({}, null , websiteAddress);	// get rid of trailing search parameters to make it tidy !!
		}

			
		$('#searchform').submit(function(e) { // this does the Submit search
			e.preventDefault();
			if($('#hintFirst').html() != '' && $('#searchFor').val().rtrim(1) != ' ') selectHint('hintFirst');

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
		
		function showTab(name) {
			
			$('#'+name).prop('checked',true);
			
		}
		
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

			var pol = '', postData = 'policy=' + showWhat + '&hl=' + userLanguage;
			$.ajax({type:'POST', url: workerURL, data: postData , async: false,
				success: function(thisText){
					pol = JSON.parse(thisText);
					document.title = t.titlepolicypre + ' : ' + pol.displayname + ' ' + t.titlepolicypost;
					if (showWhat == t.contactcode) {
						showTab('tabContact');
						$('#contactTab').html(pol.content);

					} else {
						showTab('tabPolicies');
						$('#policiesTab').html(pol.content);
					}

				},
				error: function(someotherText) {
					alert('Could not find that policy in language "' + userLanguage + '"');
				}
			});

		}
		
		function showLogin() {
						
	//		$('#loginForm').show();
		var cookieOptions = {
			textPopup: 'Sign in or register.',
			textAccept : 'Register',
			textConfigure : 'Sign in',
			textSave : 'Cancel',
			switches: [
				{	text: "I've read, and agree to, this sites policies",
					name: 'agreeUser',
					purpose: 'necessary'	
				}
			]
		}
		if(popupSignin(cookieOptions)) {
			
			$('#signinSVG').hide();
			$('#signoutSVG').show();

		}





		}

		function hideLogin() {
			
	//		$('#loginForm').hide();
			$('#signoutSVG').hide();
			$('#signinSVG').show();
		}
		
if (!navigator.userAgent.match(/bot|facebookexternalhit|google|ia_archiver|slurp|spider|yandex/i)) {	
	// if you're a search engine bot, don't bother with consent cookie screen

		var cookies = {
			textPopup: 'We use cookies to ensure you have the best experience on our site. If you continue to use our site, we will assume that you agree to their use. For more information, please read our <strong>Cookie policy</strong>.',
			btnAcceptAll : 'Accept all',
			btnConfigure : 'Configure choices',
			btnSave : 'Save choices',
			switches: [
				{	text: 'Storing user sign in details',
					name: 'cookieUser',
					default: 'checked'	
				},
				{
					text: 'Storing user preferences on this device',
					name: 'cookiePreferences',
					default: 'checked'	
				},
				{
					text: 'Allow access to location data',
					name: 'cookieLocation',
					default: ''	
				},
				{
					text: 'Allow 3rd party adverts and analysis',
					name: 'cookieAdverts',
					default: ''	
				}
			]
		}
		cookieConsent(cookies);
}

// cookie consent script added

    function getCookieValue(name) {
      let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
      return result ? result.pop() : ""
    }
	
	function setCookieValue(name, value, expires) {
		if (expires === '') {expires = '""';}
		document.cookie = name+'=' + value + '; path=/; expires=' + expires;
	}


function cookieConsent(cookies) {

	let cookiesCount = cookies.switches.length;

	let htmlCode = '<div class="popup" id="popupConsent"><section id="contentPopupConsent"><p>'+cookies["textPopup"]+'</p></section>';
	htmlCode += '<section id="configureSection"><table>';
	for(i =0; i < cookiesCount; i++) {
		htmlCode += '<tr><th><div class="switch checked" id="'+cookies.switches[i].name+'"><div class="circle" id="'+cookies.switches[i].name+'Circle"></div></div></th><th class="text-switch">'+cookies.switches[i].text+'</th></tr>';
	}
	
	htmlCode += '</table></section><div class="choice-container-buttons">';
	htmlCode += '<button class="c-button" id="btnAcceptAll"><div class="c-ripple js-ripple"><span class="c-ripple-circle-accept"></span></div>'+cookies["btnAcceptAll"]+'</button>';
	htmlCode += '<button class="c-button" id="btnConfigure"><div class="c-ripple js-ripple"><span class="c-ripple-circle-configure"></span></div>'+cookies["btnConfigure"]+'</button>';
	htmlCode += '<button class="c-button" id="btnSave"><div class="c-ripple js-ripple"><span class="c-ripple-circle-checkedIn"></span></div>'+cookies["btnSave"]+'</button>';
	htmlCode += '</div></div><div id="backgroundPopup"></div>'
	
	document.body.insertAdjacentHTML('beforeEnd', htmlCode);

	for(i =0; i < cookiesCount; i++) {
		if (cookies.switches[i].default != 'checked' ) {
			$('#' + cookies.switches[i].name + 'Circle').removeClass("move-circle-right").addClass("move-circle-left");
			$('#' + cookies.switches[i].name).removeClass("checked");
		}
	}

  //--------------Switch button-----------------
  $(".switch").click(function(){
    let idSwitch = "#" + $(this).attr('id');
    let idCircleSwitch = idSwitch + "Circle";

    if($(idSwitch).hasClass('checked')){
      $(idCircleSwitch).removeClass("move-circle-right").addClass("move-circle-left");
      $(idSwitch).removeClass("checked");
    }
    else{
      $(idCircleSwitch).removeClass("move-circle-left").addClass("move-circle-right");
      $(idSwitch).addClass("checked");
    }
  });
  // -------------Button ripple---------------
  ;(function($, window, document, undefined) {
    'use strict';
    var $ripple = $('.js-ripple');
    $ripple.on('click.ui.ripple', function(e) {

      let idButton = $(this).parents().attr('id');
      var $this = $(this);
      var $offset = $this.parent().offset();
      var $circle = $this.find('.c-ripple-circle-'+idButton);
      var x = e.pageX - $offset.left;
      var y = e.pageY - $offset.top;

      $circle.css({
        top: y + 'px',
        left: x + 'px'
      });
      $this.addClass('is-active');
    });
    $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(e) {
      $(this).removeClass('is-active');
    });
  })(jQuery, window, document);
  // -------------Popup---------------
  $(document).ready(function() {

    let date = new Date(Date.now() + 31536000000); //31536000000 = 365 jour
    date = date.toUTCString();

    let popupConsent = $('#popupConsent');
    let btnAcceptAll = $( "#btnAcceptAll" );
    let btnConfigure = $( "#btnConfigure" );
    let btnSave = $( "#btnSave" );
    let configureSection = $('#configureSection');
    let contentPopupConsent = $('#contentPopupConsent');
	
    if(!getCookieValue("cookieConsent")){
		$(btnSave).hide();
		$(popupConsent).show(200);
		document.getElementById("backgroundPopup").classList.add('background-popup');
    }

    $(btnAcceptAll).click(function() {
		for(i =0; i < cookiesCount; i++) {
			$('#'+cookies.switches[i].name).addClass('checked');
		}
		saveCookies();
    });

    $(btnConfigure).click(function() {
      $(btnConfigure).fadeOut(0);
      $(btnSave).fadeIn(0);
      $(contentPopupConsent).fadeOut(0);
      $(configureSection).fadeIn(0);
    });

    $(btnSave).click(function() {
		saveCookies();
	});
	
	function saveCookies() {
		$(popupConsent).fadeOut(200);
		for(i =0; i < cookiesCount; i++) {
			if($('#'+cookies.switches[i].name).hasClass('checked')){
				setCookieValue(cookies.switches[i].name, true, date);
			}
		}
		document.getElementById("backgroundPopup").classList.remove('background-popup');
		setCookieValue('cookieConsent', true, date);
	}
	
	
	
  });
}

function popupSignin(cookieOptions) {

}

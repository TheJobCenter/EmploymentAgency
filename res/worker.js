	var workerURL = "worker.php";
	var st = [];
	var userLanguage = window.navigator.language.substring(0,2);
	var systemLang = document.documentElement.lang.substring(0,2);
	var postData = 'xfrom='+ systemLang + '&xto=' + userLanguage;

	$.ajax({type:"POST", url: workerURL, data: postData , 
		success: function(thisText){
			st = JSON.parse(thisText);
		},
		error: function(someotherText) {
			alert('Translation error');
		}
	});

	var qwerty = st.length;
	//alert(qwerty);
	$(document).ready(function() {
		
			$('#hintFirst').click(function() {selectHint(this.id);})
			$('#hintSecond').click(function() {selectHint(this.id);})
			$('#hintThird').click(function() {selectHint(this.id);})

			$('#policyAUP').html(st[0].auptitle);
			$('#policyAUP').click(function() {showPolicy(st[0].aupcode);})
			$('#policyTOS').html(st[0].tostitle);
			$('#policyTOS').click(function() {showPolicy(st[0].toscode);})
			$('#policyCookies').html(st[0].cookiestitle);
			$('#policyCookies').click(function() {showPolicy(st[0].cookiescode);})
			$('#policyPrivacy').html(st[0].privacytitle);
			$('#policyPrivacy').click(function() {showPolicy(st[0].privacycode);})
			$('#policyGreen').html(st[0].greentitle);
			$('#policyGreen').click(function() {showPolicy(st[0].greencode);})
			$('#policyAbout').html(st[0].abouttitle);
			$('#policyAbout').click(function() {showPolicy(st[0].aboutcode);})

			$('#signinSVG').click(function() {showLogin(); })
			$('#signoutSVG').click(function() {hideLogin(); })
			$('#searchFor').attr('placeholder',st[0].searchfor);
			$('#policyTopButton').html(st[0].policies);
			var todaysDate = new Date().toISOString().slice(0,10);
			$('#dateGrid').html(st[0].lastupdated + ': <span class="dateColor">' + todaysDate + '</span>');
			hideHints();
			hideLogin();
			
	});
	
		$('#searchform').submit(function(e) { // this does the Submit search
			e.preventDefault();
			var sf = $('#searchFor').val().trim();
			if(sf.indexOf(' ') != -1) sf=sf.split(' ').toString(); // convert from space seperated list to comma seperated list

			$.ajax({type:"POST", url: workerURL, data: 'f='+ sf, 
				success: function(thisText){
					var hints = JSON.parse(thisText);
					var showResults="";
					for(i=0;i<hints.length;i++){
						showResults = showResults + ' ' + hints[i].name;
					}
					hideHints();
					document.title = "The Job Center - " + showResults; 
				},
				error: function(thisText) {
					searchError();
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
		
			$('#coding').html(st[0].nothingfound);
			
		}
	
		function showHints(where,what) {
		
			$('#'+where).show().html(what);
			$('#coding').hide().html("");

		}
		
		function hideHints() {
		
			$('#hintFirst').hide().html();
			$('#hintSecond').hide().html();
			$('#hintThird').hide().html();
			$('#coding').show().html(st[0].searchhint);

		}
		
		function showPolicy(showWhat) {
		
			$('.policyDropdownList').hide();
			var pol = new Array(), postData = "policy=" + showWhat + "&lang=" + userLanguage;

			$.ajax({type:"POST", url: workerURL, data: postData , 
				success: function(thisText){
					pol = JSON.parse(thisText);
					document.title = st[0].titlepolicypre + ' : ' + pol[0].displayname + ' ' + st[0].titlepolicypost;
					alert(pol[0].content);
					pol = Array(); // clear data
				},
				error: function(someotherText) {
					alert('Could not find a policy named "' + showWhat + '" in language "' + userLanguage + '"');
				}
			});
			$('.policyDropdownList').show();

		}
		
		function showLogin() {
			
			$('#signinGrid').prop('title',st[0].signout);
			$('#signinSVG').hide();
			$('#signoutSVG').show();
			$('#loginForm').show();
			
		}

		function hideLogin() {
			
			$('#signinGrid').prop('title',st[0].signin);	
			$('#loginForm').hide();
			$('#signoutSVG').hide();
			$('#signinSVG').show();
		}

	
//	$(document).ready(function() {

//	});

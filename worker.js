	var workerURL = "worker.php";
	var defaultTitle = "The Job Center - employment personified";
		
	$(document).ready(function() {
		
			$('#hintFirst').click(function() {selectHint(this.id);})
			$('#hintSecond').click(function() {selectHint(this.id);})
			$('#hintThird').click(function() {selectHint(this.id);})
			$('#policyAUP').click(function() {showPolicy('aup');})
			$('#policyTOS').click(function() {showPolicy('tos');})
			$('#policyCookies').click(function() {showPolicy('cookies');})
			$('#policyPrivacy').click(function() {showPolicy('privacy');})
			$('#policyGreen').click(function() {showPolicy('green');})
			$('#policyAbout').click(function() {showPolicy('about');})
			
			var todaysDate = new Date().toISOString().slice(0,10);
			$('#dateGrid').html('Last updated: <span class="dateColor">' + todaysDate + '</span>');
			hideHints();
			
	

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
//					$('#coding').html(showResults); 
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
		
			$('#coding').html('Nothing found for those search terms.');
			
		}
	
		function showHints(where,what) {
		
			$('#'+where).show().html(what);
			$('#coding').hide().html("");

		}
		
		function hideHints() {
		
			$('#hintFirst').hide().html();
			$('#hintSecond').hide().html();
			$('#hintThird').hide().html();
			$('#coding').show().html("Start typing, press 'Space' to auto-complete, 'Enter' to select.");

		}
		
		function showPolicy(showWhat) {
		
			$('.policyDropdownList').hide();
			document.title = "The Job Center - " + showWhat + " policy";
			alert('policy');			
			$('.policyDropdownList').show();
			document.title = defaultTitle;
		}

	});

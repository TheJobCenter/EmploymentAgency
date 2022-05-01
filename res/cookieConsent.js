function popupConsent(cookieOptions) {

	let numberCookies = cookieOptions.switches.length;

	let htmlCode = '<div class="popup" id="popupConsent"><section id="contentPopupConsent"><p>'+cookieOptions["textPopup"]+'</p></section>';
	htmlCode += '<section id="configureSection"><table>';
	for(i =0; i < numberCookies; i++) {
		htmlCode += '<tr><th><div class="switch checked" id="'+cookieOptions.switches[i].name+'"><div class="circle" id="'+cookieOptions.switches[i].name+'Circle"></div></div></th><th class="text-switch">'+cookieOptions.switches[i].text+'</th></tr>';
	}
	
	htmlCode += '</table></section><div class="choice-container-buttons">';
	htmlCode += '<button class="c-button" id="accept"><div class="c-ripple js-ripple"><span class="c-ripple-circle-accept"></span></div>'+cookieOptions["textAccept"]+'</button>';
	htmlCode += '<button class="c-button" id="configure"><div class="c-ripple js-ripple"><span class="c-ripple-circle-configure"></span></div>'+cookieOptions["textConfigure"]+'</button>';
	htmlCode += '<button class="c-button" id="checkedIn"><div class="c-ripple js-ripple"><span class="c-ripple-circle-checkedIn"></span></div>'+cookieOptions["textSave"]+'</button>';
	htmlCode += '</div></div><div id="backgroundPopup"></div>'
	
	document.body.insertAdjacentHTML('beforeEnd', htmlCode);

	for(i =0; i < numberCookies; i++) {
		if (cookieOptions.switches[i].purpose != 'necessary' && cookieOptions.switches[i].purpose != 'functionality') {
			$('#' + cookieOptions.switches[i].name + 'Circle').removeClass("move-circle-right").addClass("move-circle-left");
			$('#' + cookieOptions.switches[i].name).removeClass("checked");
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
    let acceptButton = $( "#accept" );
    let configureButton = $( "#configure" );
    let saveButton = $( "#checkedIn" );
    let configureSection = $('#configureSection');
    let contentPopupConsent = $('#contentPopupConsent');
	

    function getCookieValue(name) {
      let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
      return result ? result.pop() : ""
    }

    if(!getCookieValue("cookieConsent")){
		$(saveButton).hide();
		$(popupConsent).show(200);
		document.getElementById("backgroundPopup").classList.add('background-popup');
    }

    // On configure le bouton "Accepter"
    $(acceptButton).click(function() {
		$(popupConsent).fadeOut(1000);
		for(i =0; i < numberCookies; i++) {
			document.cookie = cookieOptions.switches[i].name+'=true; path=/; expires=' + date;
		}
		document.getElementById("backgroundPopup").classList.remove('background-popup');
		document.cookie = 'cookieConsent=true; path=/; expires=' + date;
    });

    $(configureButton).click(function() {
      $(configureButton).fadeOut(0);
      $(saveButton).fadeIn(0);
      $(contentPopupConsent).fadeOut(0);
      $(configureSection).fadeIn(1000);
    });

    $(saveButton).click(function() {
		$(popupConsent).fadeOut(1000);
		for(i =0; i < numberCookies; i++) {
			if($('#'+cookieOptions.switches[i].name).hasClass('checked')){
				document.cookie = cookieOptions.switches[i].name+'=true; path=/; expires=' + date;
			} 
		}
		document.getElementById("backgroundPopup").classList.remove('background-popup');
		document.cookie = 'cookieConsent=true; path=/; expires=' + date;
    });
  });
}

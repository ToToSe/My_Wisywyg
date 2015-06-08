$.fn.my_wysiwyg = function(options){

	if($(this)[0].tagName){
		elem = $(this);
		if(elem.val() != ""){
			elemV = elem.val();
		} else {
			elemV = false;
		}

		if(typeof elem.attr('name') === "undefined"){
			elemN = false;
		} else {
			elemN = elem.attr('name');
		}

		var myww = $.extend({
				radius : 5,
				backgroundColor:false,
				headerColor:false,
				buttons : ['bold','italic','underline','barre','color','font','link','indent','dedent','left','right','center','image','map','youtube','camera','micro','mail'],
				ignoreButtons : [],
				saved : localStorage.getItem('mw'),
				autoSave : 1,
				allowSave: 1,
				allowOptions : 1,
				allowCode : 1,
				sound : 0,
				noise : 'meca',
				item : null,
				lastTypedTime : 0,
				lastHeight : null,
				lastHeight2 : null,
				full : 0,
				startFull : 0,
				mwEditor : {},
				isBold : 0,
				isItal : 0,
				isSurl : 0,
				isBarr : 0,
				isLink : 0,
				isAlic : 0,
				isAlir : 0,
				isAlil : 0,
				isColo : 0,
				lastKey : 0,
				width : parseInt(elem.css('width')),
				height : parseInt(elem.css('height')),
				//socket : false,
				socket : '195.12.190.199:13013',
				containerEl : {"tagName":"N"},
				coord : null
		}, options);



		function constructTemplate() {
			var tmp = '	<div id="mw-vp">';
				tmp	+='		<div id="mw-main" style="width:'+myww.width+'px;height:'+myww.height+'px;">';
				tmp	+='			<div id="mw-button-box">';
				tmp	+='				<button class="mw-button btn-e-bold" data-b="bold"><i class="fa fa-bold"></i></button>';
				tmp	+='				<button class="mw-button btn-e-italic"  data-b="italic"><i class="fa fa-italic"></i></button>';
				tmp	+='				<button class="mw-button btn-e-underline"  data-b="underline"><i class="fa fa-underline"></i></button>';
				tmp	+='				<button class="mw-button btn-e-barre"  data-b="barre"><i class="fa fa-strikethrough"></i></button>';
				tmp	+='				<button class="mw-button btn-e-color choice"  data-b="color" data-choice="color"><i class="fa fa-paint-brush"></i></button>';
				tmp	+='				<button class="mw-button btn-e-font choice"  data-b="font" data-choice="size"><i class="fa fa-font"></i></button>';
				tmp	+='				<button class="mw-button btn-e-link choice"  data-b="link" data-choice="link"></button>';
				tmp	+='				<button class="mw-button btn-e-indent"  data-b="indent"><i class="fa fa-indent"></i></button>';
				tmp	+='				<button class="mw-button btn-e-dedent"  data-b="dedent"><i class="fa fa-dedent"></i></button>';
				tmp	+='				<button class="mw-button btn-e-left"  data-b="left"><i class="fa fa-align-left"></i></button>';
				tmp	+='				<button class="mw-button btn-e-center"  data-b="center"><i class="fa fa-align-center"></i></button>';
				tmp	+='				<button class="mw-button btn-e-right"  data-b="right"><i class="fa fa-align-right"></i></button>';
				tmp	+='				<button class="mw-button btn-e-image choice"  data-b="image" data-choice="image"><i class="fa fa-picture-o"></i></button>';
				tmp	+='				<button class="mw-button btn-e-map choice"  data-b="map" data-choice="map"><i class="fa fa-map-marker"></i></button>';
				tmp	+='				<button class="mw-button btn-e-youtube choice"  data-b="youtube" data-choice="youtube"><i class="fa fa-youtube-play"></i></button>';
				tmp	+='				<button class="mw-button btn-e-camera"  data-b="camera"><i class="fa fa-video-camera"></i></button>';
				tmp	+='				<button class="mw-button btn-e-micro"  data-b="micro"><i class="fa fa-microphone"></i></button>';
				tmp	+='				<button class="mw-button btn-e-mail choice"  data-b="mail" data-choice="mail"><i class="fa fa-envelope-o"></i></button>';	
				tmp	+='			</div>';
				tmp	+='			<div id="mw-textarea">';
				tmp	+='				<div class="noty"><span class="noty-text"></span><i class="fa fa-times"></i></div>';
				if(elemV != false){
					valueToPut = elemV;
				} else {
					valueToPut = '';
				}					
				tmp	+='				<div class="mw-textarea-c" contenteditable="true">'+valueToPut+'</div>';
				tmp	+='				<div id="mw-footer">';
				tmp	+='					<i class="fa fa-cog option-btn" data-layer="option"></i>';
				tmp	+='					<i class="fa fa-volume-off volume-btn"></i>';
				tmp	+='					<i class="fa fa-code code-btn" data-layer="code"></i>';
				tmp	+='					<i class="fa fa-floppy-o save-btn"></i>';
				tmp	+='					<span class="text-log"></span>';
				tmp	+='					<img class="exit-btn" src="img/close.png" alt="controls">';			
				tmp	+='					<img class="down-btn" src="img/min.png" alt="controls">';
				tmp	+='					<img class="full-btn" src="img/full.png" alt="controls">';		
				tmp	+='				</div>';
				tmp	+='			</div>';
				tmp	+='			<div id="mw-choice">';
				tmp	+='				<div class="calque"></div>';
				tmp	+='				<div class="choices choice-link">';
				tmp	+='					<span>Inserez votre lien :</span>';
				tmp	+='					<input class="choice-input" type="text"/>';
				tmp	+='					<button class="choice-ok" data-choice="link"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-size">';
				tmp	+='					<span>Choisissez une taille :</span>';
				tmp	+='					<input class="choice-input" type="text"/>';
				tmp	+='					<button class="choice-ok" data-choice="size"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-mail">';
				tmp	+='					<span>Inserez l\'email :</span>';
				tmp	+='					<input class="choice-input" type="text"/>';
				tmp	+='					<button class="choice-ok" data-choice="mail"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-color">';
				tmp	+='					<span>Choisissez une couleur :</span>';
				tmp	+='					<input class="choice-input" style="padding: 3px;" type="color"/>';
				tmp	+='					<button class="choice-ok" data-choice="color"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-image">';
				tmp	+='					<span>Heberger une image :</span>';
				tmp	+='					<input class="choice-input" type="file" name="image"/>';
				tmp	+='					<button class="choice-ok" data-choice="image"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-youtube">';
				tmp	+='					<span>Inserez votre lien Youtube :</span>';
				tmp	+='					<input class="choice-input choice-input-u" type="text" style="margin-bottom:5px;" placeholder="Lien"/>';
				tmp	+='					<input class="choice-input choice-input-h" type="text" style="margin-bottom:5px;" placeholder="Hauteur"/>';
				tmp	+='					<input class="choice-input choice-input-w" type="text" placeholder="Largeur"/>';
				tmp	+='					<button class="choice-ok" data-choice="youtube"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';
				tmp	+='				<div class="choices choice-map">';
				tmp	+='					<span>Choisissez la taille de la carte :</span>';
				tmp	+='					<input class="choice-input choice-input-h" type="text" style="margin-bottom:5px;" placeholder="Hauteur"/>';
				tmp	+='					<input class="choice-input choice-input-w" type="text" placeholder="Largeur"/>';
				tmp	+='					<button class="choice-ok" data-choice="map"><i class="fa fa-check-square-o"></i> Valider</button>';
				tmp	+='				</div>';					
				tmp	+='			</div>';
				tmp	+='			<div id="mw-options">';
				tmp	+='				<div id="mw-options-content">';
				tmp	+='					<div class="layer-back option-layer"></div>';
				if(elemN != false){
					nameToPut = 'name="'+elemN+'"';
				} else {
					nameToPut = '';
				}
				tmp	+='					<div class="layer-back code-layer"><textarea '+nameToPut+'>'+valueToPut+'</textarea></div>';
				tmp	+='					<div id="mw-option-footer">';
				tmp	+='						<i class="fa fa-times option-btn"></i><span class="html-format">Formater le texte</span>';
				tmp	+='					</div>';
				tmp	+='				</div>';
				tmp	+='			</div>';
				tmp	+='		</div>';	
				tmp	+='	</div>';
				return tmp;
		}

		elem.after(constructTemplate());

		$('.mw-button').each(function(index, val) {
			console.log($.inArray('italic',myww.ignoreButtons));
			if($.inArray($(this).data('b'),myww.buttons) == -1 || $.inArray($(this).data('b'),myww.ignoreButtons) != -1){
				console.log($(this).data('b'));
				$(this).remove();
				if($(this).hasClass('choice')){
					if($(this).data('b') == 'font'){
						$(this).data('b','size');
					}
					$('.choice-'+$(this).data('b')).remove();
				}
			}
		});

		$('.choice-ok, .choice-input').css('border-radius',myww.radius+'px');
		$('.mw-button').css('border-radius',myww.radius+'px');
		$('#mw-main').css('border-radius',myww.radius+'px');

		if(myww.headerColor != false){
			$('#mw-button-box').css('background-color',myww.headerColor);
		}

		if(myww.backgroundColor != false){
			$('#mw-main').css('background-color',myww.backgroundColor);
		}		

		elem.remove();

		ion.sound({
		    sounds: [
		        {name: "keyboard"},
		        {name: "meca"},
		        {name: "key"}
		    ],

		    path: "sounds/",
		    preload: true,
		    multiplay: true,
		    volume: 0.9
		});

		document.execCommand('formatBlock', false, 'p');
		$( "#mw-main" ).on('resizecreate resize',function() {
			if(myww.lastHeight != null){
				myww.lastHeight = null;
				$('.down-btn').attr('src','img/min.png');
			}
			var buttonBoxH = $('#mw-button-box').height();
			var contentH = $('#mw-main').height();
			var footerH = 75;
			$('.mw-textarea-c').css('height',contentH-buttonBoxH-footerH+'px');
		});	

		$( "#mw-main" ).resizable({    
			resize: function(event, ui) {
				if(myww.full == 1){
					$('.exit-btn').trigger('click');
					myww.full = 0;
				}
    		}
    	});	

		window.onbeforeunload = function (e) {
		    e = e || window.event;

		    if (e) {
		        e.returnValue = 'Etes vous sur ?';
		    }

		    return 'Etes vous sur ?';
		};

		function get_hostname(url) {
		    var m = url.match(/^http:\/\/[^/]+/);
		    return m ? m[0] : null;
		}

		function noty(message,color){
			if(color == 'green'){
				$('.noty').css('background-color','#2ECC71');
			} else if(color == 'red'){
				$('.noty').css('background-color','#F22613');
			}
			$('.noty-text').text(message);
			$('.noty').show('drop',{direction:'left'},function(){
				setTimeout(function(){ $('.noty').hide('drop',{direction:'left'}); },3000);
			});
		}

		function notyLog(message,time){
			if($('#mw-main').width() <= '509'){
				return false;
			}
			$('.text-log').text(message);
			$('.text-log').fadeIn();
			setTimeout(function(){
				$('.text-log').fadeOut();
			},time);
		}

		function saveFile(){
			if(myww.allowSave == 0) { return false; }
			dateNow = new Date().getTime();
			toSave = {content:btoa($('.mw-textarea-c').html()), domain:JSON.stringify(get_hostname(window.location.href)), last_update:dateNow};
			indexFile = false;
			if(myww.saved != null){
				savedJS = JSON.parse(myww.saved);
				for (var i = savedJS.length - 1; i >= 0; i--) {
					if(typeof JSON.parse(myww.saved)[i] !== 'undefined' && JSON.parse(myww.saved)[i] !== null){
						if(savedJS[i].domain == '"'+get_hostname(window.location.href)+'"'){
							savedJS[i] = toSave;
							localStorage.setItem('mw',JSON.stringify(savedJS));
						}
					}
				};
			} else {
				localStorage.setItem('mw','['+JSON.stringify(toSave)+']');
			}
		}

		function backuprange() {
		    var selection = window.getSelection();
		    if(selection.type.toLowerCase() == "none"){
		    	return false;
		    }
		    var range = selection.getRangeAt(0);
		    myww.mwEditor.currentSelection = {"startContainer": range.startContainer, "startOffset":range.startOffset,"endContainer":range.endContainer, "endOffset":range.endOffset};
			return window.getSelection().type;
		}

		function restorerange() {
		    var selection = window.getSelection();
		    selection.removeAllRanges();
		    var range = document.createRange();
		    range.setStart(myww.mwEditor.currentSelection.startContainer, myww.mwEditor.currentSelection.startOffset);
		    range.setEnd(myww.mwEditor.currentSelection.endContainer, myww.mwEditor.currentSelection.endOffset);
		    selection.addRange(range);
		}

	    function handle_geolocation_query(position){
	    	var lng = position.coords.longitude;
	    	var lat = position.coords.latitude;
	   	 	myww.coord = new Array(lng,lat);
			embed = '<iframe width="'+$('.choice-map .choice-input-w').val()+'" height="'+$('.choice-map .choice-input-h').val()+'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+myww.coord[1]+' ,'+myww.coord[0]+'&amp;hl=es;z=14&amp;output=embed"></iframe>';
			if($('.mw-textarea-c').text().length == 0){
				$('.mw-textarea-c').append(embed);
			} else {
				document.execCommand("Inserthtml", false, embed);
			}	   	 	
	        return myww.coord;
	    }

		function ytVidId(url){
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[2].length == 11) {
			  return match[2];
			} else {
			  return false;
			}
		}

		$('body').on('focus', '[contenteditable]', function() {
		    var $this = $(this);
		    $this.data('before', $this.html());
		    return $this;
		}).on('blur keyup paste input', '[contenteditable]', function() {
		    var $this = $(this);
		    if ($this.data('before') !== $this.html()) {
		        $this.data('before', $this.html());
		        $this.trigger('change');
		    }
		    return $this;
		});

		$('.mw-textarea-c').change(function(){
			myww.lastTypedTime = 0;
			if($('.mw-textarea-c').html() == ""){
				document.execCommand('formatBlock', false, 'p');
			}
			$('.code-layer textarea').val($('.mw-textarea-c').html());
		});

		if(elemV == false){
			if(myww.saved != null){
				listSavedHere = Array();
				htmlChanged = false;
				for (var i = JSON.parse(myww.saved).length - 1; i >= 0; i--) {
					if(typeof JSON.parse(myww.saved)[i] !== 'undefined' && JSON.parse(myww.saved)[i] !== null){
						if(JSON.parse(myww.saved)[i].domain == '"'+get_hostname(window.location.href)+'"'){
							$('.mw-textarea-c').html(atob(JSON.parse(myww.saved)[i].content));
							$('.mw-textarea-c').trigger('change');
							htmlChanged = true;
						}
					}
				};
				if(!htmlChanged){
					$('.mw-textarea-c').html('<p></p>');
					$('.mw-textarea-c').trigger('change');
					document.execCommand('formatBlock', false, 'p');
				}
			}
		}

	   if(window.XMLHttpRequest) {
	       xhr_object = new XMLHttpRequest(); 
	   } else if(window.ActiveXObject) 
	   xhr_object = new ActiveXObject("Microsoft.XMLHTTP"); 
	   else { 
	     xhr_object = false;
	   }

		if(xhr_object !== false){
			 xhr_object.onreadystatechange = function() { 
			     if(xhr_object.readyState==4 && xhr_object.status==200) {
			        var data = JSON.parse(xhr_object.responseText);
			        if(data.status == 'good'){
			        	colorNot = 'green';
						embed = '<img src="upload/'+data.data+'" alt="image mw">';
						if($('.mw-textarea-c').text().length == 0){
							$('.mw-textarea-c').append(embed);
						} else {
							document.execCommand("Inserthtml", false, embed);
						}
			        } else {
			        	colorNot = 'red';
			        }
			        noty(data.data,colorNot);
			    }
			 }
		}	
		if(myww.autoSave == 1){
			setInterval(function(){
				notyLog('Enregistrement automatique ...',3000);
				saveFile();
			},30000);

			setInterval(function(){
				if(myww.lastTypedTime == 3){
					notyLog('Enregistrement automatique ...',3000);
					saveFile();
				}
				myww.lastTypedTime++;
			},1000);
		}

		$('.noty i').click(function(){
			$('.noty').hide('drop',{direction:'left'});
		});

		$('.choice').click(function(){
			if($(this).data('choice') == 'link' && myww.isLink === "true"){
				document.execCommand('unlink',false,false);
			} else {
				if($(this).data('choice') != 'mail'){
					valueRange = backuprange();
					if(!valueRange){
						return false;
					}
					if($(this).data('choice') == "link"){
						if(valueRange.toLowerCase() != "range"){
							return false;
						}
					}
				}
				$('#mw-choice').css('top','0%');
				$('.choice-'+$(this).data('choice')).fadeIn();
			}
		});

		$('.choice-ok').click(function(){
			$('#mw-choice').css('top','-100%');
			$('.choice-'+$(this).data('choice')).fadeOut();
		});

		$('.option-btn, .code-btn').click(function(){
			if(parseInt($('#mw-options').css('left')) > '0'){
				$('#mw-options').css('left','0%');
				$('.layer-back').css('display','none');
				$('.'+$(this).data('layer')+'-layer').fadeIn();
				if($(this).data('layer') == 'code'){
					$('.html-format').fadeIn();
				}
			} else {
				$('.html-format').fadeOut();
				$('#mw-options').css('left','100%');
				$('.mw-textarea-c').html($('.code-layer textarea').val());
			}
		});

		$('.html-format').click(function(){
			$.post('indent.php',{msg:btoa($('.code-layer textarea').val())},function(data){
				$('.code-layer textarea').val(atob(data));
			});
		});

		$('.volume-btn').click(function(){
			if(myww.sound == 1){
				$(this).removeClass('fa-volume-up').addClass('fa-volume-off');
				myww.sound = 0;
			} else {
				$(this).removeClass('fa-volume-off').addClass('fa-volume-up');
				myww.sound = 1;
			}
		});	

		$('.save-btn').click(function(){
			saveFile();
			noty('Fichier enregistrer avec succeess','green');
		});	

		$('.exit-btn').click(function(){
			if(myww.full == 1){
				$('.full-btn').fadeIn();
				$('.down-btn').fadeIn();
				$('#mw-main').appendTo('#mw-vp');
				$('#mw-full').remove();
				myww.full = 0;
				lastHeightTab = myww.lastHeight2.split('|');
				$('#mw-main').css('width',lastHeightTab[1]+'px');
				$('#mw-main').css('height',lastHeightTab[0]+'px');
				$('#mw-main').trigger('resize');			
			} else {
				$('#mw-main').fadeOut(function(){
					$('#mw-main').remove();
				});
			}
		});	

		$('.full-btn').click(function(){
			myww.lastHeight2 = $('.mw-textarea-c').height()+'|'+$('#mw-main').width();
			$('body').append('<div id="mw-full"></div>');
			$('#mw-main').appendTo('#mw-full');
			$('#mw-main').css('width','100%');
			$('#mw-main').css('height','100%');
			$('.full-btn').fadeOut();
			$('.down-btn').fadeOut();
			myww.full = 1;
			$( "#mw-main" ).trigger('resize');
		});						

		$('.down-btn').click(function(){
			if($('.down-btn').attr('src') == 'img/max.png'){
				lastHeightTab = myww.lastHeight.split('|');
				$('.mw-textarea-c').animate({'height':lastHeightTab[0]+'px','opacity':1});
				$('#mw-main').animate({'height':lastHeightTab[1]+'px'});
				$('.down-btn').attr('src','img/min.png');
			} else {
				myww.lastHeight = $('.mw-textarea-c').height()+20+'|'+$('#mw-main').height();
				$('.mw-textarea-c').animate({'height':'0px','opacity':0});
				$('#mw-main').animate({'height':$('#mw-button-box').height()+96+'px'});
				$('.down-btn').attr('src','img/max.png');
			}
		});			

		$('.mw-textarea-c').keypress(function(e){
			document.execCommand('formatBlock', false, 'p');
			if(myww.sound == 1){
				if(myww.lastKey != e.keyCode){
					ion.sound.play(myww.noise);
					myww.lastKey = e.keyCode;
				}
			}
		});

		$('.mw-textarea-c').keyup(function(e){
			myww.lastKey = 0;
		});	

		$('.btn-e-bold').click(function(){
			document.execCommand('bold', false, null);
		});

		$('.btn-e-italic').click(function(){
			document.execCommand('italic', false, null);
		});	

		$('.btn-e-barre').click(function(){	
			document.execCommand('strikeThrough', false, null);
		});	

		$('.btn-e-underline').click(function(){
			document.execCommand('underline', false, null);
		});	

		$('.btn-e-left').click(function(){
			document.execCommand('justifyLeft', false, null);
		});		

		$('.btn-e-right').click(function(){
			document.execCommand('justifyRight', false, null);
		});	

		$('.btn-e-center').click(function(){
			document.execCommand('justifyCenter', false, null);
		});	

		$('.btn-e-indent').click(function(){
			document.execCommand('indent', false, null);
			tmpP = parseInt($('.mw-textarea-c').find('blockquote p').css('padding-left'))+40;
			$('.mw-textarea-c').find('blockquote p').css('padding-left',tmpP+'px');
			tmpBQ = $('.mw-textarea-c').find('blockquote').html();
			$('.mw-textarea-c').find('blockquote').after(tmpBQ);
			$('.mw-textarea-c').find('blockquote').remove();
		});	

		$('.btn-e-dedent').click(function(){
			document.execCommand('outdent', false, null);
			document.execCommand('indent', false, null);
			if(parseInt($('.mw-textarea-c').find('blockquote p').css('padding-left')) > 0){
				tmpP = parseInt($('.mw-textarea-c').find('blockquote p').css('padding-left'))-40;
			} else {
				tmpP = 0;
			}
			$('.mw-textarea-c').find('blockquote p').css('padding-left',tmpP+'px');
			tmpBQ = $('.mw-textarea-c').find('blockquote').html();
			$('.mw-textarea-c').find('blockquote').after(tmpBQ);
			$('.mw-textarea-c').find('blockquote').remove();		
		});					

		$('.choice-ok').click(function(){
			if($(this).data('choice') == 'link'){
				restorerange();
				document.execCommand('createlink', false, $('.choice-link .choice-input').val());
				$('.choice-link .choice-input').val('');
			}
			if($(this).data('choice') == 'size'){
				restorerange();
				if($.isNumeric($('.choice-size .choice-input').val())){
					document.execCommand('fontSize', false, '7');
					var fontElements = document.getElementsByTagName("font");
				    for (var i = 0, len = fontElements.length; i < len; ++i) {
				        if (fontElements[i].size == "7") {
				            fontElements[i].removeAttribute("size");
				            fontElements[i].style.fontSize = $('.choice-size .choice-input').val()+'px';
				        }
				    }					
					$('.choice-size .choice-input').val('');
				} else {
					noty('Taille de police invalide !','red');
				}
			}
			if($(this).data('choice') == 'color'){
				restorerange();
				document.execCommand('ForeColor', false, $('.choice-color .choice-input').val());
				$('.choice-color .choice-input').val('');
			}	
			if($(this).data('choice') == 'mail'){
				$.post('mail.php',{mail:$('.choice-mail .choice-input').val(),msg:btoa($('.mw-textarea-c').html())},function(data){
					if(data == 'good'){
						noty('Email envoyé avec success','green');
					} else {
						noty('Impossible d\'envoyé l\'email','red');
					}
				});
				$('.choice-mail .choice-input').val('');
			}				
			if($(this).data('choice') == 'image'){	
			   restorerange();	   
			   if(xhr_object !== false){
				  var formData = new FormData();
				  inp = $('.choice-image .choice-input');
				  formData.append("image", inp[0].files[0]);
				  if(typeof inp[0].files[0] !== "undefined"){
					  xhr_object.open("POST", "upload.php", true); 
					  xhr_object.send(formData); 
				  }
			   } else {
			   		noty('Ajax impossible !','red');
			   }
			}				
			if($(this).data('choice') == 'youtube'){
				restorerange();
				if(ytVidId($('.choice-youtube .choice-input-u').val())){
					if($.isNumeric($('.choice-youtube .choice-input-w').val())){
						if($.isNumeric($('.choice-youtube .choice-input-h').val())){ 
							embed = '<iframe width="'+$('.choice-youtube .choice-input-w').val()+'" height="'+$('.choice-youtube .choice-input-h').val()+'" src="https://www.youtube.com/embed/'+ytVidId($('.choice-youtube .choice-input-u').val())+'" frameborder="0" allowfullscreen></iframe>';
							if($('.mw-textarea-c').text().length == 0){
								$('.mw-textarea-c').append(embed);
							} else {
								document.execCommand("Inserthtml", false, embed);
							}
						} else {
							noty('Taille du player invalide !','red');
						}
					} else {
						noty('Taille du player invalide !','red');
					}
				} else {
					noty('Lien Youtube invalide !','red');
				}
				$('.choice-youtube .choice-input-u').val('');
				$('.choice-youtube .choice-input-w').val('');
				$('.choice-youtube .choice-input-h').val('');
			}	
			if($(this).data('choice') == 'map'){
				restorerange();
				if($.isNumeric($('.choice-map .choice-input-w').val())){
					if($.isNumeric($('.choice-map .choice-input-h').val())){
						navigator.geolocation.getCurrentPosition(handle_geolocation_query); 
					} else {
						noty('Taille de la map invalide !','red');
					}
				} else {
					noty('Taille de la map invalide !','red');
				}	
				document.execCommand('ForeColor', false, $('.choice-color .choice-input').val());
				$('.choice-color .choice-input').val('');
			}												
		});	

		$(".choice-input").keyup(function(event){
		    if(event.keyCode == 13){
		        $(this).next().trigger('click');
		    }
		});	

		$(document).keyup(function(e) {
			if(parseInt($('#mw-choice').css('top')) > -100){
		  		if (e.keyCode == 27) $('.choice-ok').trigger('click');
			}
		});		
	
		$(window).bind('keydown', function(event) {
		    if (event.ctrlKey || event.metaKey) {
		        switch (String.fromCharCode(event.which).toLowerCase()) {
		        case 's':
		            event.preventDefault();
		            if(myww.allowSave == 1){
		            	$('.save-btn').trigger('click');
		            }
		            break;
		        case 'g':
		            event.preventDefault();
		            if(myww.allowCode == 1){
		            	$('.code-btn').trigger('click');
		            }	
		            break;
		        case 'z':
		            event.preventDefault();
		            document.execCommand('undo', false, null);
		            break;
		        case 'y':
		            event.preventDefault();
		            document.execCommand('redo', false, null);
		            break;		            		            
		        }			        
		    }
		});

		setInterval(function () {
		    myww.isBold = document.queryCommandValue("Bold");		    
		    myww.isSurl = document.queryCommandValue("underline");		    
		    myww.isBarr = document.queryCommandValue("strikeThrough");		    
		    myww.isItal = document.queryCommandValue("Italic");
		   	myww.isLink = document.queryCommandValue("link");
		   	myww.isAlil = document.queryCommandValue("justifyLeft");
		   	myww.isAlir = document.queryCommandValue("justifyRight");
		   	myww.isAlic = document.queryCommandValue("justifyCenter");
		   	myww.isColo = document.queryCommandValue("ForeColor");

		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.rangeCount) {
		            myww.containerEl = sel.getRangeAt(0).commonAncestorContainer;
		            if (myww.containerEl.nodeType == 3) {
		                myww.containerEl = myww.containerEl.parentNode;
		            }
		        }
		    } else if ( (sel = document.selection) && sel.type != "Control") {
		        myww.containerEl = sel.createRange().parentElement();
		    }

		    if(myww.containerEl.tagName == 'A'){
		        $('.btn-e-link').css({'color':'white','background-color':'black'});
		        $('.btn-e-link').html('<i class="fa fa-unlink"></i>');
		        myww.isLink = "true";
		    } else {
		        $('.btn-e-link').css({'color':'black','background-color':'white'});
		        $('.btn-e-link').html('<i class="fa fa-link"></i>');
		        myww.isLink = "false";
		    }

		    if (myww.isColo !== 'rgb(0, 0, 0)') {
		        $('.btn-e-color').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-color').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isBold === 'true') {
		        $('.btn-e-bold').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-bold').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isAlic === 'true') {
		        $('.btn-e-center').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-center').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isAlir === 'true') {
		        $('.btn-e-right').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-right').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isAlil === 'true') {
		        $('.btn-e-left').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-left').css({'color':'black','background-color':'white'});
		    }		    		    		    

		    if (myww.isSurl === 'true') {
		        $('.btn-e-underline').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-underline').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isItal === 'true') {
		        $('.btn-e-italic').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-italic').css({'color':'black','background-color':'white'});
		    }

		    if (myww.isBarr === 'true') {
		        $('.btn-e-barre').css({'color':'white','background-color':'black'});
		    } else {
		        $('.btn-e-barre').css({'color':'black','background-color':'white'});
		    }		    		    		    
		}, 100);

		if(myww.socket != false){
			var socket = io.connect('http://'+myww.socket);
			socket.on('update-myww', function(data){
				backuprange();
				$('.mw-textarea-c').html(atob(data));
				restorerange();			
			});

			$('.mw-textarea-c').change(function(){
				socket.emit('send-myww',btoa($('.mw-textarea-c').html()));
			});
		}

		if(myww.startFull == 1){
			$('.full-btn').trigger('click');
		}

		if(myww.allowSave == 0){
			$('.save-btn').css('display','none');
		}		

		if(myww.allowOptions == 0){
			$('.option-btn').css('display','none');
		}		

		if(myww.allowCode == 0){
			$('.code-btn').css('display','none');
		}				

		if(myww.sound == 1){
			$('.volume-btn').removeClass('fa-volume-off').addClass('fa-volume-up');
		}

	} else {
		console.log('The element must be a Textarea');
	}
};


// Ion.Sound | version 3.0.4 | https://github.com/IonDen/ion.sound
;(function(k,e,m,r){k.ion=k.ion||{};if(!ion.sound){var l=function(a){a||(a="undefined");if(k.console){console.warn&&"function"===typeof console.warn?console.warn(a):console.log&&"function"===typeof console.log&&console.log(a);var b=m&&m("#debug");if(b&&b.length){var c=b.html();b.html(c+a+"<br/>")}}},f=function(a,b){var c;b=b||{};for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};if("function"!==typeof Audio&&"object"!==typeof Audio)e=function(){l("HTML5 Audio is not supported in this browser")},
ion.sound=e,ion.sound.play=e,ion.sound.stop=e,ion.sound.pause=e,ion.sound.preload=e,ion.sound.destroy=e,e();else{e=/iPad|iPhone|iPod/.test(e.appVersion);var q=0,c={},d={},b;!c.supported&&e?c.supported=["mp3","mp4","aac"]:c.supported||(c.supported=["mp3","ogg","mp4","aac","wav"]);ion.sound=function(a){f(a,c);c.path=c.path||"";c.volume=c.volume||1;c.preload=c.preload||!1;c.multiplay=c.multiplay||!1;c.loop=c.loop||!1;c.sprite=c.sprite||null;c.scope=c.scope||null;c.ready_callback=c.ready_callback||null;
c.ended_callback=c.ended_callback||null;if(q=c.sounds.length)for(b=0;b<q;b++){a=c.sounds[b];var n=a.alias||a.name;d[n]||(d[n]=new p(a),d[n].init())}else l("No sound-files provided!")};ion.sound.VERSION="3.0.2";ion.sound._method=function(a,c,e){if(c)d[c]&&d[c][a](e);else for(b in d)if(d.hasOwnProperty(b)&&d[b])d[b][a](e)};ion.sound.preload=function(a,b){b=b||{};f({preload:!0},b);ion.sound._method("init",a,b)};ion.sound.destroy=function(a){ion.sound._method("destroy",a);if(a)d[a]=null;else for(b in d)d.hasOwnProperty(b)&&
d[b]&&(d[b]=null)};ion.sound.play=function(a,b){ion.sound._method("play",a,b)};ion.sound.stop=function(a,b){ion.sound._method("stop",a,b)};ion.sound.pause=function(a,b){ion.sound._method("pause",a,b)};ion.sound.volume=function(a,b){ion.sound._method("volume",a,b)};m&&(m.ionSound=ion.sound);e=k.AudioContext||k.webkitAudioContext;var g;e&&(g=new e);var p=function(a){this.options=f(c);delete this.options.sounds;f(a,this.options);this.request=null;this.streams={};this.result={};this.ext=0;this.url="";
this.autoplay=this.no_file=this.decoded=this.loaded=!1};p.prototype={init:function(a){a&&f(a,this.options);this.options.preload&&this.load()},destroy:function(){var a;for(b in this.streams)(a=this.streams[b])&&a.destroy();this.streams={};this.result=null;this.options=this.options.buffer=null;this.request&&(this.request.removeEventListener("load",this.ready.bind(this),!1),this.request.removeEventListener("error",this.error.bind(this),!1),this.request.abort(),this.request=null)},createUrl:function(){var a=
(new Date).valueOf();this.url=this.options.path+encodeURIComponent(this.options.name)+"."+this.options.supported[this.ext]+"?"+a},load:function(){this.no_file?l('No sources for "'+this.options.name+'" sound :('):(this.createUrl(),this.request=new XMLHttpRequest,this.request.open("GET",this.url,!0),this.request.responseType="arraybuffer",this.request.addEventListener("load",this.ready.bind(this),!1),this.request.addEventListener("error",this.error.bind(this),!1),this.request.send())},reload:function(){this.ext++;
this.options.supported[this.ext]?this.load():(this.no_file=!0,l('No sources for "'+this.options.name+'" sound :('))},ready:function(a){this.result=a.target;4!==this.result.readyState?this.reload():200!==this.result.status?(l(this.url+" was not found on server!"),this.reload()):(this.request.removeEventListener("load",this.ready.bind(this),!1),this.request.removeEventListener("error",this.error.bind(this),!1),this.request=null,this.loaded=!0,this.decode())},decode:function(){g&&g.decodeAudioData(this.result.response,
this.setBuffer.bind(this),this.error.bind(this))},setBuffer:function(a){this.options.buffer=a;this.decoded=!0;a={name:this.options.name,alias:this.options.alias,ext:this.options.supported[this.ext],duration:this.options.buffer.duration};this.options.ready_callback&&"function"===typeof this.options.ready_callback&&this.options.ready_callback.call(this.options.scope,a);if(this.options.sprite)for(b in this.options.sprite)this.options.start=this.options.sprite[b][0],this.options.end=this.options.sprite[b][1],
this.streams[b]=new h(this.options,b);else this.streams[0]=new h(this.options);this.autoplay&&(this.autoplay=!1,this.play())},error:function(){this.reload()},play:function(a){delete this.options.part;a&&f(a,this.options);if(!this.loaded)this.options.preload||(this.autoplay=!0,this.load());else if(!this.no_file&&this.decoded)if(this.options.sprite)if(this.options.part)this.streams[this.options.part].play(this.options);else for(b in this.options.sprite)this.streams[b].play(this.options);else this.streams[0].play(this.options)},
stop:function(a){if(this.options.sprite)if(a)this.streams[a.part].stop();else for(b in this.options.sprite)this.streams[b].stop();else this.streams[0].stop()},pause:function(a){if(this.options.sprite)if(a)this.streams[a.part].pause();else for(b in this.options.sprite)this.streams[b].pause();else this.streams[0].pause()},volume:function(a){if(a)if(f(a,this.options),this.options.sprite)if(this.options.part)(a=this.streams[this.options.part])&&a.setVolume(this.options);else for(b in this.options.sprite)(a=
this.streams[b])&&a.setVolume(this.options);else(a=this.streams[0])&&a.setVolume(this.options)}};var h=function(a,b){this.alias=a.alias;this.name=a.name;this.sprite_part=b;this.buffer=a.buffer;this.start=a.start||0;this.end=a.end||this.buffer.duration;this.multiplay=a.multiplay||!1;this.volume=a.volume||1;this.scope=a.scope;this.ended_callback=a.ended_callback;this.setLoop(a);this.gain=this.source=null;this.paused=this.playing=!1;this.time_offset=this.time_played=this.time_ended=this.time_started=
0};h.prototype={destroy:function(){this.stop();this.source=this.buffer=null;this.gain&&this.gain.disconnect();this.source&&this.source.disconnect();this.source=this.gain=null},setLoop:function(a){!0===a.loop?this.loop=9999999:"number"===typeof a.loop&&(this.loop=+a.loop-1)},update:function(a){this.setLoop(a);"volume"in a&&(this.volume=a.volume)},play:function(a){a&&this.update(a);if(this.multiplay||!this.playing)this.gain=g.createGain(),this.source=g.createBufferSource(),this.source.buffer=this.buffer,
this.source.connect(this.gain),this.gain.connect(g.destination),this.gain.gain.value=this.volume,this.source.onended=this.ended.bind(this),this._play()},_play:function(){var a,b;this.paused?(a=this.start+this.time_offset,b=this.end-this.time_offset):(a=this.start,b=this.end);0>=b?this.clear():(this.source.start(0,a,b),this.playing=!0,this.paused=!1,this.time_started=(new Date).valueOf())},stop:function(){this.source&&this.source.stop(0);this.clear()},pause:function(){this.paused?this.play():this.playing&&
(this.source&&this.source.stop(0),this.paused=!0)},ended:function(){this.playing=!1;this.time_ended=(new Date).valueOf();this.time_played=(this.time_ended-this.time_started)/1E3;this.time_offset+=this.time_played;if(this.time_offset>=this.end||.015>this.end-this.time_offset)this._ended(),this.clear(),this.loop&&(this.loop--,this.play())},_ended:function(){var a={name:this.name,alias:this.alias,part:this.sprite_part,start:this.start,duration:this.end};this.ended_callback&&"function"===typeof this.ended_callback&&
this.ended_callback.call(this.scope,a)},clear:function(){this.time_offset=this.time_played=0;this.playing=this.paused=!1},setVolume:function(a){this.volume=a.volume;this.gain&&(this.gain.gain.value=this.volume)}};g||(function(){var a=new Audio,b=a.canPlayType("audio/mpeg"),e=a.canPlayType("audio/ogg"),a=a.canPlayType('audio/mp4; codecs="mp4a.40.2"'),d,f;for(f=0;f<c.supported.length;f++)d=c.supported[f],b||"mp3"!==d||c.supported.splice(f,1),e||"ogg"!==d||c.supported.splice(f,1),a||"aac"!==d||c.supported.splice(f,
1),a||"mp4"!==d||c.supported.splice(f,1)}(),p.prototype={init:function(a){a&&f(a,this.options);this.inited=!0;this.options.preload&&this.load()},destroy:function(){var a;for(b in this.streams)(a=this.streams[b])&&a.destroy();this.streams={};this.inited=this.loaded=!1},load:function(){var a;this.options.preload=!0;this.options._ready=this.ready;this.options._scope=this;if(this.options.sprite)for(b in this.options.sprite)a=this.options.sprite[b],this.options.start=a[0],this.options.end=a[1],this.streams[b]=
new h(this.options,b);else this.streams[0]=new h(this.options)},ready:function(a){this.loaded||(this.loaded=!0,a={name:this.options.name,alias:this.options.alias,ext:this.options.supported[this.ext],duration:a},this.options.ready_callback&&"function"===typeof this.options.ready_callback&&this.options.ready_callback.call(this.options.scope,a),this.autoplay&&(this.autoplay=!1,this.play()))},play:function(a){if(this.inited)if(delete this.options.part,a&&f(a,this.options),this.loaded)if(this.options.sprite)if(this.options.part)this.streams[this.options.part].play(this.options);
else for(b in this.options.sprite)this.streams[b].play(this.options);else this.streams[0].play(this.options);else this.options.preload||(this.autoplay=!0,this.load())},stop:function(a){if(this.inited)if(this.options.sprite)if(a)this.streams[a.part].stop();else for(b in this.options.sprite)this.streams[b].stop();else this.streams[0].stop()},pause:function(a){if(this.inited)if(this.options.sprite)if(a)this.streams[a.part].pause();else for(b in this.options.sprite)this.streams[b].pause();else this.streams[0].pause()},
volume:function(a){if(a)if(f(a,this.options),this.options.sprite)if(this.options.part)(a=this.streams[this.options.part])&&a.setVolume(this.options);else for(b in this.options.sprite)(a=this.streams[b])&&a.setVolume(this.options);else(a=this.streams[0])&&a.setVolume(this.options)}},h=function(a,b){this.name=a.name;this.alias=a.alias;this.sprite_part=b;this.multiplay=a.multiplay;this.volume=a.volume;this.preload=a.preload;this.path=c.path;this.start=a.start||0;this.end=a.end||0;this.scope=a.scope;
this.ended_callback=a.ended_callback;this._scope=a._scope;this._ready=a._ready;this.setLoop(a);this.url=this.sound=null;this.loaded=!1;this.played_time=this.paused_time=this.start_time=0;this.init()},h.prototype={init:function(){this.sound=new Audio;this.sound.volume=this.volume;this.createUrl();this.sound.addEventListener("ended",this.ended.bind(this),!1);this.sound.addEventListener("canplaythrough",this.can_play_through.bind(this),!1);this.sound.addEventListener("timeupdate",this._update.bind(this),
!1);this.load()},destroy:function(){this.stop();this.sound.removeEventListener("ended",this.ended.bind(this),!1);this.sound.removeEventListener("canplaythrough",this.can_play_through.bind(this),!1);this.sound.removeEventListener("timeupdate",this._update.bind(this),!1);this.sound=null;this.loaded=!1},createUrl:function(){var a=(new Date).valueOf();this.url=this.path+encodeURIComponent(this.name)+"."+c.supported[0]+"?"+a},can_play_through:function(){this.preload&&this.ready()},load:function(){this.sound.src=
this.url;this.sound.preload=this.preload?"auto":"none";this.preload&&this.sound.load()},setLoop:function(a){!0===a.loop?this.loop=9999999:"number"===typeof a.loop&&(this.loop=+a.loop-1)},update:function(a){this.setLoop(a);"volume"in a&&(this.volume=a.volume)},ready:function(){!this.loaded&&this.sound&&(this.loaded=!0,this._ready.call(this._scope,this.sound.duration),this.end||(this.end=this.sound.duration))},play:function(a){a&&this.update(a);!this.multiplay&&this.playing||this._play()},_play:function(){if(this.paused)this.paused=
!1;else try{this.sound.currentTime=this.start}catch(a){}this.playing=!0;this.start_time=(new Date).valueOf();this.sound.volume=this.volume;this.sound.play()},stop:function(){if(this.playing){this.paused=this.playing=!1;this.sound.pause();this.clear();try{this.sound.currentTime=this.start}catch(a){}}},pause:function(){this.paused?this._play():(this.playing=!1,this.paused=!0,this.sound.pause(),this.paused_time=(new Date).valueOf(),this.played_time+=this.paused_time-this.start_time)},_update:function(){this.start_time&&
(this.played_time+((new Date).valueOf()-this.start_time))/1E3>=this.end&&this.playing&&(this.stop(),this._ended())},ended:function(){this.playing&&(this.stop(),this._ended())},_ended:function(){this.playing=!1;var a={name:this.name,alias:this.alias,part:this.sprite_part,start:this.start,duration:this.end};this.ended_callback&&"function"===typeof this.ended_callback&&this.ended_callback.call(this.scope,a);this.loop&&setTimeout(this.looper.bind(this),15)},looper:function(){this.loop--;this.play()},
clear:function(){this.paused_time=this.played_time=this.start_time=0},setVolume:function(a){this.volume=a.volume;this.sound&&(this.sound.volume=this.volume)}})}}})(window,navigator,window.jQuery||window.$);




window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"><' + '/script>');
  }
  
  var modules = google.maps.modules = {};
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };
  
  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;
    apiLoad([0.009999999776482582,[[["https://mts0.googleapis.com/vt?lyrs=m@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.googleapis.com/vt?lyrs=m@305000000\u0026src=api\u0026hl=fr-FR\u0026"],null,null,null,null,"m@305000000",["https://mts0.google.com/vt?lyrs=m@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.google.com/vt?lyrs=m@305000000\u0026src=api\u0026hl=fr-FR\u0026"]],[["https://khms0.googleapis.com/kh?v=174\u0026hl=fr-FR\u0026","https://khms1.googleapis.com/kh?v=174\u0026hl=fr-FR\u0026"],null,null,null,1,"174",["https://khms0.google.com/kh?v=174\u0026hl=fr-FR\u0026","https://khms1.google.com/kh?v=174\u0026hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/vt?lyrs=h@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.googleapis.com/vt?lyrs=h@305000000\u0026src=api\u0026hl=fr-FR\u0026"],null,null,null,null,"h@305000000",["https://mts0.google.com/vt?lyrs=h@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.google.com/vt?lyrs=h@305000000\u0026src=api\u0026hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/vt?lyrs=t@132,r@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.googleapis.com/vt?lyrs=t@132,r@305000000\u0026src=api\u0026hl=fr-FR\u0026"],null,null,null,null,"t@132,r@305000000",["https://mts0.google.com/vt?lyrs=t@132,r@305000000\u0026src=api\u0026hl=fr-FR\u0026","https://mts1.google.com/vt?lyrs=t@132,r@305000000\u0026src=api\u0026hl=fr-FR\u0026"]],null,null,[["https://cbks0.googleapis.com/cbk?","https://cbks1.googleapis.com/cbk?"]],[["https://khms0.googleapis.com/kh?v=85\u0026hl=fr-FR\u0026","https://khms1.googleapis.com/kh?v=85\u0026hl=fr-FR\u0026"],null,null,null,null,"85",["https://khms0.google.com/kh?v=85\u0026hl=fr-FR\u0026","https://khms1.google.com/kh?v=85\u0026hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt/ft?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/vt?hl=fr-FR\u0026","https://mts1.googleapis.com/vt?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt/loom?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt/ft?hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt/loom?hl=fr-FR\u0026"]]],["fr-FR","US",null,0,null,null,"https://maps.gstatic.com/mapfiles/","https://csi.gstatic.com","https://maps.googleapis.com","https://maps.googleapis.com",null,"https://maps.google.com","https://gg.google.com","https://maps.gstatic.com/maps-api-v3/api/images/","https://www.google.com/maps",0],["https://maps.gstatic.com/maps-api-v3/api/js/20/11c/intl/fr_ALL","3.20.11c"],[195682705],1,null,null,null,null,null,"",null,null,1,"https://khms.googleapis.com/mz?v=174\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"https://mts.googleapis.com/vt/icon",[["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],null,null,null,null,null,null,null,null,null,null,["https://mts0.google.com/vt","https://mts1.google.com/vt"],"/maps/vt",305000000,132],2,500,[null,"https://g0.gstatic.com/landmark/tour","https://g0.gstatic.com/landmark/config",null,"https://www.google.com/maps/preview/log204","","https://static.panoramio.com.storage.googleapis.com/photos/",["https://geo0.ggpht.com/cbk","https://geo1.ggpht.com/cbk","https://geo2.ggpht.com/cbk","https://geo3.ggpht.com/cbk"]],["https://www.google.com/maps/api/js/master?pb=!1m2!1u20!2s11c!2sfr-FR!3sUS!4s20/11c/intl/fr_ALL","https://www.google.com/maps/api/js/widget?pb=!1m2!1u20!2s11c!2sfr-FR"],null,0,0,"/maps/api/js/ApplicationService.GetEntityDetails",0], loadScriptTime);
  };
  var loadScriptTime = (new Date).getTime();
  getScript("https://maps.gstatic.com/maps-api-v3/api/js/20/11c/intl/fr_ALL/main.js");
})();
$(document).ready(function(){

	if(localStorage.token == undefined){
		$.mobile.changePage( '#signin');
	}

	// base url
	var baseUrl = "http://127.0.0.1:8000"

	// gif load
	$(document).ajaxStart(function() {
	    $.mobile.loading('show');
	});

	$(document).ajaxStop(function() {
	    $.mobile.loading('hide');
	});


	$.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	           o[this.name] = this.value || '';
	       }
	   });
	   return o;
	};

	$('form[name="signup"]').submit(function(event){
		event.preventDefault();
		$.ajax({
		    type: "POST",
		    url: baseUrl+"/users/",
		    data: $(this).serializeObject(),
            success: function(data, status, s) {
            	if(s.status == 201){
            		alert("Cadastro concluído com sucesso.");
            		alert("Faça o login.");
            		$.mobile.changePage( '#signin', { transition: "slide", reverse: true });
            	}
            },
            error : function(res, a, v) {
                if(res.status == 400){
	            	var msg = "";
					jQuery.each(JSON.parse(res.responseText), function(i, val) {
					  msg += val+'\n';
					  alert(val);
					});
					// alert(msg);
                }else{
                	alert('Ops! Ocorreu algum erro. Tente mais tarde.');
                }
            },
            crossDomain:false
		});

	});

	$('form[name="signin"]').submit(function(event){
		event.preventDefault();
		$.ajax({
		    type: "POST",
		    url: baseUrl+"/api-token-auth/",
		    data: $(this).serializeObject(),
            success: function(data, status, s) {
            	if(s.status == 200){
            		localStorage.token = data.token
            		$.mobile.changePage( '#home', { transition: "slide"});
            	}else if(s.status == 400){
            		alert("E-mail ou senha invalidos.");
            	}else{
            		alert('Ops! Ocorreu algum erro. Tente mais tarde.');
            	}
            },
            error : function(res, a, v) {
                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
            },
            crossDomain:false
		});
	});


	// carrega a pagina de configuracao inicial
	$('#categories').on("pageshow",function(event){
		// carrega a lista de todas as categorias disponiveis
        $.ajax({
            url: baseUrl+"/categories/",
            dataType : 'json',
            type: 'GET',
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
			},
            success: function(data, status, s) {
            	console.log(data);
            	var categories = "";
            	for(i=0; i<data[0].categories.length; i++){
            		categories += '<label for="'+data[0].categories[i].pk+'" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off">'+data[0].categories[i].fields.category+'</label><input type="checkbox" id="'+data[0].categories[i].pk	+'">';
            	}
            	$('form[name="categories"] fieldset').html(categories);
            	$('form[name="categories"] fieldset').trigger('create');
            	// $('.selector').prop('checked', true).checkboxradio('refresh');
            	$('form[name="categories"] fieldset .ui-checkbox input').each(function(){
            		for(x=0; x<data[0].userCategory.length; x++){
            			if($(this).attr('id') == data[0].userCategory[x].fields.category){
            				$(this).prop('checked', true).checkboxradio('refresh');
            			}
            		}
            	});
            },
            error : function(res) {
            	console.log(res);
                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
            },
            crossDomain:false
        });
	}).on("pagehide",function(event){ $(this).find("fieldset").empty() });

	$(document).on("click touchstart", 'form[name="categories"] fieldset .ui-checkbox', function(){
		var catId = $(this).find('input').attr('id');
	    if($(this).find('label').hasClass('ui-checkbox-off')){
			$.ajax({
	            url: baseUrl+"/user-categories/"+catId+"/",
	            dataType : 'json',
	            type: 'POST',
				beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
				},
	            success: function(data, status, s) {
	            	console.log(data);
	            },
	            error : function(res) {
	            	console.log(res);
	                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
	            },
	            crossDomain:false
			});
	    }else{
			$.ajax({
	            url: baseUrl+"/user-categories/"+catId+"/",
	            dataType : 'json',
	            type: 'DELETE',
				beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
				},
	            success: function(data, status, s) {
	            	console.log(data);
	            },
	            error : function(res) {
	            	console.log(res);
	                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
	            },
	            crossDomain:false
			});  	
	    }
	});

	$('#game').on("pageshow",function(event){
		$('#game .ui-content').html("");
        $.ajax({
            url: baseUrl+"/categories/",
            dataType : 'json',
            type: 'GET',
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
			},
            success: function(data, status, s) {

            	var categories = '<div data-role="controlgroup">';
            	for(i=0; i<data[0].userCategory.length; i++){
            		for(x=0; x<data[0].categories.length; x++){
            			if(data[0].categories[x].pk == data[0].userCategory[i].fields.category){
            				categories += '<a href="#" class="ui-btn category" data-category-id="'+data[0].categories[x].pk+'">'+data[0].categories[x].fields.category+'</a>';
            			}
            		}
            	}
            	$('#game .ui-content').html(categories+'<div/>');
            	$('#game .ui-content').trigger('create');
            },
            error : function(res) {
            	console.log(res);
                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
            },
            crossDomain:false
        });
	}).on("pagehide",function(event){ $(this).find(".ui-content").empty() });

	$(document).on("click touchstart", '#game .category', function(){
		var cat = $(this).data('category-id');

		if(typeof(Storage)!=="undefined") {
		    localStorage.gameCat=cat;            
		}

		$.mobile.changePage( '#getPlayer', { transition: "slide"});
	});

	var contador = {
	    start : function() {
	        this.interval = setInterval(function(){
			    var val = $(".ui-loader h1 span").html();
			    var sec= parseInt(val);

			    if((sec-1) == 0){
			    	contador.stop();
			    	$.mobile.loading( "hide" );
			    }
			    $(".ui-loader h1 span").html(sec-1);
	        },1000);
	    },
	    stop : function() {
	        clearInterval(this.interval);
	    }
	}

	$('#getPlayer').on("pageshow", function(event){
	    setTimeout(function(){
			contador.stop();
			contador.start();
			$.mobile.loading( "show", {
	            text: "Buscando um oponente...",
	            textVisible: true,
	            theme: "a",
	            textonly: false
			});
			$(".ui-loader h1").append(" <span>30</span>");
		});

		$.ajax({
            url: baseUrl+"/game-start/"+localStorage.gameCat+"/",
            dataType : 'json',
            type: 'POST',
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
			},
            success: function(data, status, s) {
            	console.log(data);
            },
            error : function(res) {
            	console.log(res);
                alert('Ops! Ocorreu algum erro. Tente mais tarde.');
            },
            crossDomain:false
		});

	});

});
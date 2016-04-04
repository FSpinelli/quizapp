$(document).ready(function(){

	if(localStorage.token == undefined){
		$.mobile.changePage( '#signin');
	}else{
		$.mobile.changePage( '#home');
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
	$('#categories').on("pagecreate",function(event){
		// carrega a lista de todas as categorias disponiveis
        $.ajax({
            url: baseUrl+"/categories/",
            dataType : 'json',
            type: 'GET',
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", "JWT "+localStorage.token);
			},
            success: function(data, status, s) {
            	// console.log(data);
            	var categories = "";
            	for(i=0; i<data[0].categories.length; i++){
            		categories += '<label for="'+data[0].categories[i].pk+'" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off">'+data[0].categories[i].fields.category_pt+'</label><input type="checkbox" id="'+data[0].categories[i].pk	+'">';
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
	});

	// $(document).on("click", 'form[name="categories"] fieldset .ui-checkbox', function(){
	//     if($(this).find('label').hasClass('ui-checkbox-off')){
	//     	alert('checked');	
	//     }
	// });

});
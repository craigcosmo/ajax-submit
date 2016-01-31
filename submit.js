(function($){
	$.fn.ajaxSubmit = function(options){
		var defaults = {
			url:'',
			preventSubmit:'submiting',
			dataType:'json',
			onSubmit:function(){return true;},
			onSuccess:function(i){},
			onError:function(i){},
			data:'',
			resubmisable:true,
			method: 'POST',
			validate: '',
			onValidate:function () {return true;}
		},
		o = $.extend({},defaults, options);
		
		return this.each(function(){
			var $this=$(this);
			
			var isForm = $this.is('form') ===true ? true : false;

			var send = function(data){
				$.ajax({
				  	method: o.method,
				  	url: o.url,
				  	cache: false,
				  	data: data,
				  	dataType: o.dataType,
				  	success: function(i){
			  			if(i.status == 'success'){
							o.onSuccess.call(this, i);
							if(o.resubmisable)	$this.removeClass(o.preventSubmit);
						}
						else if(i.status == 'error'){
							o.onError.call(this, i);
							$this.removeClass(o.preventSubmit);
						}
						else{
							// console.log('this');
							o.onSuccess.call(this, i);
							if(o.resubmisable)	$this.removeClass(o.preventSubmit);
						}
				  	}
				});
			};

			var form_handle = function(){
				$this.find('input[type="text"], input[type="password"]', 'textarea').keyup(function(e){
					// console.log('key');
					// e.preventDefault();
					// weird case: the enter will always submit the form even with e.prevendefault. even when not call submit()
					// it would still submit. therefore only set submissable to true if the keycode is not 13
					if(e.which != 13){ $this.removeClass(o.preventSubmit);}
					// if (e.which == 13 && submisable) { console.log('keyup');} //$this.submit();}
					// e.preventDefault();
				});
				// this to submit with cmd + enter key. currently not working
				// $this.find('textarea').keyup(function(e){
				// 	// ctrl + enter to submit
				// 	if(e.ctrlKey && e.which == 13 && submisable){$this.submit();}
				// 	// or cmd + enter to submit
				// 	else if(e.which == 224 && e.which == 13 && submisable){$this.submit();}
				// });

				// this listen to change of those element, if they change, allow user to submit again
				$this.find('input[type="checkbox"], input[type="radio"],select').change(function(e){
					$this.removeClass(o.preventSubmit);
				});

				// this for rare case that needs resubmit although the fields haven't changed at all
				// $this.find('input[type="checkbox"], input[type="radio"], textarea, select').bind('doit',function(){
				// 	submisable = true;
				// });
			};
			function form_validate()
			{	
				$this.find('input, select, textarea').removeClass('error');
				object = {};
				$.each(o.validate, function(key, el){
					if( $(el).val() ==='' ) {
						$(el).addClass('error');
						object[el] = 'empty';
					}else{
						$(el).removeClass('error');
					}
				});
				// console.log(object);
				o.onValidate.call(this, object);
				
				// if error
				if( !$.isEmptyObject(object) ){
					// console.log('this not empty');
					$this.removeClass(o.preventSubmit);
					return false;
				} 

			}

			if (isForm) {
				form_handle();
				$this.submit(function(e){
					e.preventDefault();
					if($this.hasClass(o.preventSubmit)) return;

					if(o.validate && form_validate() === false) return;
					

					if(o.onSubmit.call(this)===false){
						$this.removeClass(o.preventSubmit);
						return;			
					}
					
					if(o.data) {data = $.param(o.data)+'&' + $this.serialize();}
					else{ data = $this.serialize();}

					send(data);
					$this.addClass(o.preventSubmit);
					// console.log('sending');
				});
			}else{
				
				$this.click(function(e){
					//if this has class submiting, disable submit
					

					//if element is a link, prevent linking
					// this is important, if element is a container
					// and we use preventdefault, it will apply
					// to all child el, make link unclick able
					// hence we need the code below to check
					if( $this.is("a") )e.preventDefault();

				});
				if( $this.hasClass('submiting') )  return;

				$this.addClass(o.preventSubmit);
				// o.onSubmit.call(this);
				if(o.onSubmit.call(this)===false){
					$this.removeClass(o.preventSubmit);
					return;			
				}
				send(o.data);
			}
		});
	};
	//  never use this plugin on object document, because it will cause the bug that prevent links working. Which is clicking on the link will go anywhere
	
})(jQuery);
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
			resubmisable:false
		},
		o = $.extend({},defaults, options);
		
		return this.each(function(){
			var $this=$(this);
			var submisable= true;
			var data ='';
			var isForm = $this.is('form') ==true ? true : false;
			//console.log($this.attr('class'));


			var send = function(){
				$this.addClass(o.preventSubmit);
				$this.click(function(e){e.preventDefault();});//if element is a link

				o.onSubmit.call(this);
				$.post(o.url,o.data ,
				function(i){
					if(i.status == 'success' && o.dataType == 'json'){
						o.onSuccess.call(this, i);
						if(o.resubmisable){$this.removeClass(o.preventSubmit);}
					}
					else if(i.status == 'error' && o.dataType == 'json'){
						o.onError.call(this, i);
						$this.removeClass(o.preventSubmit);
					}
					else{	
						o.onSuccess.call(this, i);
						if(o.resubmisable){$this.removeClass(o.preventSubmit);}
					}
				},o.dataType);
			};


			if(isForm){

				$this.submit(function(e){
					e.preventDefault();
					if(!submisable) return;
					submisable = false;
					
					if(o.onSubmit.call(this)==false){
						submisable =true;
						return;				
					}
					if(o.data){data = $.param(o.data)+'&';}
					$.post(o.url, data + $this.serialize() ,
					function(i){
						if(i.status == 'success' && o.dataType == 'json'){
							o.onSuccess.call(this, i);
						}
						else if(i.status == 'error' && o.dataType == 'json'){
							o.onError.call(this, i);
							submisable =true;
						}// incase server don't return error or success message, but the response is complete
						else{
							o.onSuccess.call(this, i);
							// console.log('after submit = '+submisable);
						}
					},o.dataType);
				});


				$this.find('input[type="text"], input[type="password"]').keyup(function(e){
					// console.log('key');
					// e.preventDefault();
					// weird case: the enter will always submit the form even with e.prevendefault. even when not call submit()
					// it would still submit. therefore only set submissable to true if the keycode is not 13
					if(e.which != 13){ submisable =true; console.log('the sub 13');}
					// if (e.which == 13 && submisable) { console.log('keyup');} //$this.submit();}
					// e.preventDefault();
				});
				$this.find('textarea').keyup(function(e){
					// ctrl + enter to submit
					if(e.ctrlKey && e.which == 13 && submisable){$this.submit();}
					// or cmd + enter to submit
					else if(e.which == 224 && e.which == 13 && submisable){$this.submit();}
				});
				$this.find('input[type="checkbox"], input[type="radio"],select').change(function(e){
					submisable =true;
				});

				// this for rare case that needs resubmit although the fields haven't changed at all
				// $this.find('input[type="checkbox"], input[type="radio"], textarea, select').bind('doit',function(){
				// 	submisable = true;
				// });
				console.log('before submit = '+ submisable);
			}
			if(!isForm && !$this.hasClass(o.preventSubmit)){
				send();
			}
						
			$.fn.ajaxSubmit.resubmisable= function(targetForm) {
				$(targetForm).find('input[type="checkbox"], input[type="radio"], textarea, select').trigger('doit');
				$(targetForm).find('input[type="text"], input[type="password"]').keyup();
			};
			

		});
	}
	
})(jQuery);
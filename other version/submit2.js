(function($){
	$.fn.ajaxSubmit = function(options){
		let defaults = {
			url:'',
			preventSubmit:'submiting',
			dataType:'json',
			onSubmit:function(){return true},
			onSuccess:function(i){},
			onError:function(i){},
			data:'',
			resubmisable:true,
			method: 'POST'
		},
		o = $.extend({},defaults, options)
		
		return this.each(function(){
			let $this=$(this)
			let data =''
			let isForm = $this.is('form') ==true ? true : false

			let send = function(data){
				$.ajax({
				  	method: o.method,
				  	url: o.url,
				  	cache: false,
				  	data: data,
				  	complete: function(i){
			  			if(i.status == 'success' && o.dataType == 'json'){
							o.onSuccess.call(this, i)
							if(o.resubmisable)	$this.removeClass(o.preventSubmit)
						}
						else if(i.status == 'error' && o.dataType == 'json'){
							o.onError.call(this, i)
							$this.removeClass(o.preventSubmit)
						}
						else{
							o.onSuccess.call(this, i)
							$this.removeClass(o.preventSubmit)
						}
				  	},
				})
			}

			let form_handle = function(){
				$this.find('input[type="text"], input[type="password"]', 'textarea').keyup(function(e){
					// console.log('key');
					// e.preventDefault();
					// weird case: the enter will always submit the form even with e.prevendefault. even when not call submit()
					// it would still submit. therefore only set submissable to true if the keycode is not 13
					if(e.which != 13){ $this.removeClass(o.preventSubmit)}
					// if (e.which == 13 && submisable) { console.log('keyup');} //$this.submit();}
					// e.preventDefault();
				})
				// this to submit with cmd + enter key. currently not working
				// $this.find('textarea').keyup(function(e){
				// 	// ctrl + enter to submit
				// 	if(e.ctrlKey && e.which == 13 && submisable){$this.submit();}
				// 	// or cmd + enter to submit
				// 	else if(e.which == 224 && e.which == 13 && submisable){$this.submit();}
				// });

				// this listen to change of those element, if they change, allow user to submit again
				$this.find('input[type="checkbox"], input[type="radio"],select').change(function(e){
					$this.removeClass(o.preventSubmit)
				})

				// this for rare case that needs resubmit although the fields haven't changed at all
				// $this.find('input[type="checkbox"], input[type="radio"], textarea, select').bind('doit',function(){
				// 	submisable = true;
				// });
			}


			if (isForm) {
				form_handle()
				$this.submit(function(e){
					e.preventDefault()

					if(o.data) data = $.param(o.data)+'&'
					data = data + $this.serialize()

					if($this.hasClass(o.preventSubmit)) return
					$this.addClass(o.preventSubmit)

					if(o.onSubmit.call(this)==false){
						$this.removeClass(o.preventSubmit)
						return			
					}
					send(data)
				})
			}else{
				data = o.data

				$this.addClass(o.preventSubmit)

				$this.click(function(e){e.preventDefault()})//if element is a link

				o.onSubmit.call(this)
				send(data)
			}
		})
	}
	//  never use this plugin on object document, because it will cause the bug that prevent links working. Which is clicking on the link will go anywhere
	
})(jQuery)
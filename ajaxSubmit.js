(function($){
	$.fn.ajaxSubmit = function(options){
		var defaults = {
			url:'',
			submitButton:'.submitBtn',
			dataType:'json',
			onSubmit:function(){return true;},
			onSuccess:function(i){},
			onError:function(i){},
			data:'',
			varData:'',
			resubmisable:false
		},
		o = $.extend({},defaults, options);
		
		return this.each(function(){
			var $this=$(this);
			var submisable= true;
			var button = $this.find(o.submitButton);
			//console.log($this.attr('class'));
			
			if($this.is('form')){
				$this.submit(function(e){
					e.preventDefault();
					if(submisable){
						submisable = false;
						if(o.onSubmit.call(this)==false){
							submisable =true;
							return;				
						}
						var data='';
						if(o.data){
							data = $.param(o.data)+'&';
						}
						var varData='';
						if(o.varData){
							var object = {};
							$.each(o.varData, function(key, el) {
								var v = $(el).html();
								object[key]=v; 
							});
							varData = $.param(object)+'&';	
						}
						
						$.post(o.url,varData + data + $this.serialize() ,
						function(i){
							// check if returned data is json
							if(i.status == 'ok' && o.dataType == 'json'){
								o.onSuccess.call(this, i);
							}
							else if(i.status == 'error' && o.dataType == 'json'){
								o.onError.call(this, i);
								submisable =true;
							}
							else{
								o.onSuccess.call(this, i);
							}
						},o.dataType);
					}
				});
				
				$this.find('input[type="text"], input[type="password"]').keyup(function(e){
					if (e.which == 13 || e.which == 10 ) {
						if(submisable){$this.submit();}
					}else{
						submisable =true;
					}
				});
				$this.find('input[type="checkbox"], input[type="radio"], textarea, select').bind('doit',function(){
					submisable = true;
				});
				$this.on('click', button,function(e){
					button.closest('form').submit();
				});
				
			}
			else{
				if(!$this.hasClass('submiting')){
					$this.addClass('submiting');
					$this.click(function(e){e.preventDefault();});//if element is a link
					o.onSubmit.call(this);
					$.post(o.url,o.data ,
					function(i){
						if(i.status == 'ok' && o.dataType == 'json'){
							o.onSuccess.call(this, i);
							// alert('d');
							if(o.resubmisable){$this.removeClass('submiting');}
						}
						else if(i.status == 'error' && o.dataType == 'json'){
							o.onError.call(this, i);
							$this.removeClass('submiting');
						}
						else{
							o.onSuccess.call(this, i);
							if(o.resubmisable){$this.removeClass('submiting');}
						}
					},o.dataType);
				}
			}
						
			$.fn.ajaxSubmit.resubmisable= function(targetForm) {
				$(targetForm).find('input[type="checkbox"], input[type="radio"], textarea, select').trigger('doit');
				$(targetForm).find('input[type="text"], input[type="password"]').keyup();
			};
			

		});
	}
	
})(jQuery);

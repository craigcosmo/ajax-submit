(function($){
	$.fn.ajaxSubmit = function(options){
		var defaults = {
			url:'',
			loader:'.loading',
			preventSubmit:'submiting',
			submitButton:'.submitBtn',
			dataType:'json',
			onSubmit:function(){return true;},
			success:function(i){},
			error:function(i){},
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
			function loading() {
				if($(o.loader, $this).length){$(o.loader, $this).toggle();}
			}
			function loading2() {
				if($this.siblings(o.loader).length){$this.siblings(o.loader).toggle();}
			}
			
			if($this.is('form')){
				$this.submit(function(e){
					e.preventDefault();
					if(submisable){
						submisable = false;
						loading();
						$('.error').hide();
						if(o.onSubmit.call(this)==false){
							loading();
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
							if(i.status == 'success' && o.dataType == 'json'){
								$('.error').hide();
								loading();
								o.success.call(this, i);
							}
							else if(i.status == 'error' && o.dataType == 'json'){
								loading();
								o.error.call(this, i);
								submisable =true;
							}
							else{
								loading();
								o.success.call(this, i);
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
				button.live('click',function(e){
					$(e.target).closest('form').submit();
				});
				
			}
			else{
				if(!$this.hasClass(o.preventSubmit)){
					$this.addClass(o.preventSubmit);
					$this.click(function(e){e.preventDefault();});//if element is a link
					loading2();
					o.onSubmit.call(this);
					$.post(o.url,o.data ,
					function(i){
						if(i.status == 'success' && o.dataType == 'json'){
							loading2();
							o.success.call(this, i);
							if(o.resubmisable){$this.removeClass(o.preventSubmit);}
						}
						else if(i.status == 'error' && o.dataType == 'json'){
							loading2();
							o.error.call(this, i);
							$this.removeClass(o.preventSubmit);
						}
						else{
							loading2();
							o.success.call(this, i);
							if(o.resubmisable){$this.removeClass(o.preventSubmit);}
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

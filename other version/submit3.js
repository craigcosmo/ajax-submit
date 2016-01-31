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
			method: 'POST'
		},
		o = $.extend({},defaults, options);
		
		return this.each(function(){
			var $this=$(this);
			
			var isForm = $this.is('form') ==true ? true : false;

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
				  	},
				});
			};

		
			if (isForm) {

				$this.submit(function(e){
					e.preventDefault();
					if($this.hasClass(o.preventSubmit)) return;
					
					if(o.onSubmit.call(this)==false){
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
					if( ($this).is("a") )e.preventDefault();
				});//if element is a link
				$this.addClass(o.preventSubmit);
				o.onSubmit.call(this);
				send(o.data);
			}
		});
	}
	//  never use this plugin on object document, because it will cause the bug that prevent links working. Which is clicking on the link will go anywhere
	
})(jQuery);
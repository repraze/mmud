(function($){
    const isMobile = ('ontouchstart' in document.documentElement);
    $.fn.mmud = function(settings, client){
        settings = Object.assign({
            max : 100
        }, settings);
        client = client || new Client();

        return this.each(function(){
            var $this = $(this);

            var form = $($this.find('.mmud-form')[0]);
            var input = $($this.find('.mmud-action')[0]);
            var button = $($this.find('.mmud-send')[0]);
            var sroll = $($this.find('.mmud-screen-scroll')[0]);
            var text = $($this.find('.mmud-screen-text')[0]);

            autosize(input);

            var scroll = function(){
                var h = sroll[0].scrollHeight;
                sroll.scrollTop(h);
            }

            var count = 0;
            client.on('text', function(str){
                var shouldScroll = sroll[0].scrollHeight===sroll.scrollTop()+sroll[0].offsetHeight;

                text.append('<div>'+str.replace("\n", "<br />")+'</div>');
                if(count<settings.max){
                    ++count;
                }else{
                    text.find('div').first().remove();
                }

                if(shouldScroll){
                    scroll();
                }
            });

            form.submit(function(){
                var str = input.val();
                if(str !== ""){
                    client.send(str);
                }
                input.val("");
                autosize.update(input);
                return false;
            });

            input.keypress(function(event){
                if(!isMobile && event.keyCode === 13 && !event.shiftKey){
                    form.submit();
                    return false;
                }
            });
        });
    };
}(jQuery));

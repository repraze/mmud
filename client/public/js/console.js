(function($){
    const isMobile = ('ontouchstart' in document.documentElement);
    $.fn.mmud = function(settings, client){
        settings = Object.assign({
            max : 100
        }, settings);
        client = client || new Client();

        return this.each(function(){
            var $this = $(this);

            var title   = $($this.find('.mmud-title')[0]);
            var form    = $($this.find('.mmud-form')[0]);
            var input   = $($this.find('.mmud-action')[0]);
            var button  = $($this.find('.mmud-send')[0]);
            var sroll   = $($this.find('.mmud-screen-scroll')[0]);
            var text    = $($this.find('.mmud-screen-text')[0]);

            title.text(client.url);

            autosize(input);

            var scroll = function(){
                var h = sroll[0].scrollHeight;
                sroll.scrollTop(h);
            }

            var last;
            var count = 0;
            var newLine = function(){
                last = $('<div class="mmud-line"></div>');
                text.append(last);
                ++count;
                if(count<settings.max){
                    ++count;
                }else{
                    text.find('div').first().remove();
                }
                return last;
            };
            newLine();

            var add = function(str){
                var shouldScroll = sroll[0].scrollHeight===sroll.scrollTop()+sroll[0].offsetHeight;

                if(str.indexOf("\n")==-1){
                    last.append(str);
                }else{
                    str.split(/\r?\n/).forEach(function(line){
                        last.append(line);
                        newLine();
                    });
                }

                if(shouldScroll){
                    scroll();
                }
            }

            client.on('text', add);

            form.submit(function(){
                var str = input.val();
                add(str+"\n");
                if(str !== ""){
                    client.send(str);
                }
                input.val("");
                autosize.update(input);
                input.focus();
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

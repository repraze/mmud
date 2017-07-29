(function($){
    const isMobile = ('ontouchstart' in document.documentElement);
    $.fn.mmud = function(settings, client){
        settings = Object.assign({
            max : 100,
            lineWidth : 80
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
            var linelength = 0;
            var newLine = function(){
                last = $('<div class="mmud-line"></div>');
                text.append(last);
                if(count<=settings.max){
                    ++count;
                }else{
                    text.find('div').first().remove();
                }
                linelength = 0;
                return last;
            };
            newLine();
            var addStr = function(str){
                let available = settings.lineWidth-linelength;
                if(str.length < available){
                    linelength+=str.length;
                    last.append(str);
                }else{
                    linelength+=available;
                    last.append(str.substring(0,available));
                    newLine();
                    addStr(str.substring(available,str.length));
                }
            };

            var add = function(str){
                var shouldScroll = sroll[0].scrollHeight===sroll.scrollTop()+sroll[0].offsetHeight;

                if(str.indexOf("\n")==-1){
                    last.append(str);
                    addStr(str);
                }else{
                    console.log(str.split(/\r?\n/));
                    str.split(/\r?\n/).forEach(function(line){
                        addStr(line);
                        if(line !== ""){
                            newLine();
                        }
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

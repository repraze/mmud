class Command{
    constructor(name, syntax, run){
        this.name   = name;
        this.syntax = syntax || [];
        this.run    = run || function(){};
    }

    match(tockens, validators, runtime){
        validators = validators || {};

        for(let i = 0; i < this.syntax.length; ++i){
            let syntax = this.syntax[i].split(/\s+/);
            if(tockens[0] === syntax[0]){
                let args = this.validate(tockens, syntax, validators);
                if(args){
                    runtime.args = args;
                    return true;
                }
            }
        }
        return false;
    }

    // ping [string:name+] [name+]
    validate(tockens, syntax, validators){
        let args = {};
        for(var i = 0; i < syntax.length; ++i) {
            let key = syntax[key];
            if(key.charAt(0)==='['){
                let param = key.match(/\[([^:\+]*):?([^\+]*)?(\+)?\]/);
                let name = param[2] || param[1];
                let type = param[2] ?  param[1] : undefined;
                let multy = !!param[3];

                let value = multy ? tockens.join(' ') : tockens.shift();
                if(type && validators[type]){
                    try {
                        value = validators[type].validate(value);
                    }catch(){
                        return;
                    }
                }
                args[name] = value;
            }else{
                if(key !== tockens.shift().toLowerCase()){
                    return;
                }
            }
        }
        return args;
    }
}

class Validator{
    constructor(name, validate){
        this.name       = name;
        this.validate   = validate || function(s){return s;};
    }
}

class Parser{
    constructor(){
        this.commands = {};
        this.validators = {};
    }

    bind(obj){
        if(obj instanceof Command){
            this.commands[obj.name] = obj;
        }
        if(obj instanceof Validator){
            this.validators[obj.name] = obj;
        }
        return this;
    }

    exec(input, runtime){
        runtime = runtime || {};
        return new Promise(function(res, rej){
            var tockens = Parser.tokenize(input);
            for(let commandName in this.commands){
                let command = this.commands[commandName];
                if(command.match(tockens, this.validators, runtime)){
                    return command.run(runtime);
                }
            }
        });
    }

    static tokenize(str){
        let tockens = str.match(/"([^"]*)"|\S+/g);
        tockens = tockens.map((s)=>{
            return (s.charAt(0)==='"' && s.charAt(s.length-1)==='"')
                ? s.substr(1,s.length-2)
                : s;
        });
        return tockens;
    }
}

console.log(Parser.tokenize("hello world"));
console.log(Parser.tokenize('hello world "move it"'));
console.log(Parser.tokenize('hello world "move it'));
console.log(Parser.tokenize('ç(- 67\' hello world "move it"'));
console.log(Parser.tokenize('ç(-   67\'      hello world  "move it" "fezf è-_éè     76" daz "zef'));

module.exports = {
    Command : Command,
    Parser  : Parser
};

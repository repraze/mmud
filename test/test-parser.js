const   chai                = require('chai'),
        expect              = chai.expect,
        {Parser, Command}   = require('../engine/parser');

describe('mmud-parser', function(){
    describe('parser tokenize', function(){
        it('should split on spaces', function(){
            expect(Parser.tokenize("hello world")).to.deep.equal(["hello", "world"]);
            expect(Parser.tokenize("hello  world")).to.deep.equal(["hello", "world"]);
            expect(Parser.tokenize(" hello   world  ")).to.deep.equal(["hello", "world"]);
        });

        it('should allow special chars', function(){
            expect(Parser.tokenize("3çà& °ç&ç' %=}]")).to.deep.equal(["3çà&", "°ç&ç'", "%=}]"]);
        });

        it('should not split within double quotes', function(){
            expect(Parser.tokenize('hello world "move it"')).to.deep.equal(["hello", "world", "move it"]);
        });

        it('should ignore unmatched quotes', function(){
            expect(Parser.tokenize('hello world "move it')).to.deep.equal(["hello", "world", '"move', "it"]);
            expect(Parser.tokenize('hello world move" it')).to.deep.equal(["hello", "world", 'move"', "it"]);
            expect(Parser.tokenize('hello world move it"')).to.deep.equal(["hello", "world", 'move', 'it"']);
            expect(Parser.tokenize('hello world move" it"')).to.deep.equal(["hello", "world", 'move"', 'it"']);
        });
    });
});

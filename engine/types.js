class Types{
    static bool(val){
        if(val === "true" || val === "1"){
            return true;
        }else if(val === "false" || val === "0"){
            return false;
        }
        throw new Error(`'${val}' Not a valid bool`);
    }

    static string(val){
        if(typeof val === 'string' || val instanceof String){
            return val;
        }
        throw new Error(`'${val}' Not a valid string`);
    }

    static int(val){
        if(!isNaN(val) && parseInt(Number(val)) == val && !isNaN(parseInt(val, 10))){
            return parseInt(val, 10);
        }
        throw new Error(`'${val}' Not a valid int`);
    }
}

module.exports = {
    bool    : Types.bool,
    string  : Types.string,
    int     : Types.int,
}

var express = require('express');
var app = express();
app.get('/:operation/:num1/:num2', function (req, res) {
    var num1 = parseFloat(req.params.num1);
    var num2 = parseFloat(req.params.num2);
    if(req.params.operation == "dodaj" || req.params.operation == "add")
    {
        res.send("Wynik: "+ (num1 + num2));
    }
    else if(req.params.operation == "odejmij" || req.params.operation == "subtract")
    {
        res.send("Wynik: "+ (num1 - num2));
    }
    else if(req.params.operation == "pomnoz" || req.params.operation == "times")
    {
        res.send("Wynik: "+ (num1 * num2));
    }
    else if(req.params.operation == "podziel" || req.params.operation == "divide")
    {
        if(num2!=0)
        {
            res.send("Wynik: "+ (num1 / num2));
        }
        else{
            res.send("Error");
        }
    }
    else{
        res.send("Error");
    }
});
    

app.listen(3000);


var jun = [];

var content = document.getElementById('content');
content.onmousemove = function()
{

    var divs = document.getElementsByTagName("div");
    document.getElementById("content").appendChild(document.createElement("div"));
    var lastdiv = divs[divs.length-1];

    var e = event || window.event;
    lastdiv.style.top = e.clientY-(1/2)*lastdiv.offsetHeight+"px";
    lastdiv.style.left = e.clientX-(1/2)*lastdiv.offsetWidth+"px";


    for(var i=1;i<divs.length;i++)
    {

        jun.length = divs.length;
        if(jun[i]!=2)
        {
            jun[i] = 1;
        }

        var otop = divs[i].offsetTop;
        var oleft = divs[i].offsetLeft;
        transport(otop,oleft,i,jun[i]);




    }


    function transport(otop,oleft,i,jun)
    {
            var ntop = otop;
            var nleft = oleft;
            function c_place()
            {

                for (var i=1;i<divs.length;i++)
                {
                var jran = Math.random();
                var xtag, ytag;

                if(jran<0.25)
                {
                    xtag = 1; ytag = 1;

                }
                else if(0.25<jran&&jran<0.5)
                {
                    xtag = 1; ytag = -1;
                }
                else if(0.5<jran&&jran<0.75)
                {
                    xtag=-1;ytag = 1;
                }
                else if(0.75<jran&&jran<1)
                {
                    xtag=-1;ytag=-1;
                }

                var xran = xtag*Math.random()*10;
                var yran = ytag*Math.random()*10;
                nleft = nleft + xran;
                ntop = ntop + yran;

                divs[i].style.top = ntop+"px";
                divs[i].style.left = nleft+"px";
            }
            }

            var d = setInterval(c_place,300);

           function deletediv()
           {
               clearInterval(d);
               divs[i].parentNode.removeChild(divs[i]);
           }
            setTimeout(deletediv,300);
            drop();


    }
}




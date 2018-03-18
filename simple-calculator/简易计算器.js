var choose;
var A;
var B;
var C;

function Translate(a)
{
    return parseInt(a);
}

function Changeresult()
{
    var newresult = C;
    var head1 = document.getElementById("head1");
	document.form1.shurukuang.value=newresult;
}

function Jiafa( )
{
    choose=1;
    A = document.form1.shurukuang.value;
    document.form1.shurukuang.value = 0;
}

function Jianfa()
{
    choose=2;
    A = document.form1.shurukuang.value;
    document.form1.shurukuang.value = 0;
}

function Chengfa()
{
    choose=3;
    A = document.form1.shurukuang.value;
    document.form1.shurukuang.value = 0;
}

function Chufa()
{
    choose=4;
    A = document.form1.shurukuang.value;
    document.form1.shurukuang.value = 0;
}

function Result()
{
    B = document.form1.shurukuang.value;
    document.form1.shurukuang.value = 0;
    if(choose==1)
    {
        C = Translate(A)+Translate(B);
        Changeresult();
    }

    else if (choose == 2) {
        C = A - B;
        Changeresult();
    }

    else if (choose == 3) {
        C = A * B;
        Changeresult();
    }

    else if (choose == 4) {
        C = A / B;
        Changeresult();
    }

    else
    {
        alert("Try again!");
    }

}

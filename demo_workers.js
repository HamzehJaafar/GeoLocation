var i=0;

function timedCount()
{
i=i+1;
postMessage(12);                   //posts a message back to the HTML page.
setTimeout("timedCount()",500);
}

timedCount();
import"./main.1e029260.js";import"./bootstrap.esm.42a4b9c6.js";let a={0:"bg-danger",1:"bg-primary",2:"bg-warning",3:"bg-success"},c=[42,39,37,33,29,0,0,0,0],n=[10,9,7,5,4,0,0,0,0],g=[70,65,60,55,50,45,40,35,30],u=[100,95,90,85,80,75,70,65,60],i={0:"WantedScores",1:"LightScores",2:"ImageScores",3:"PictureScores"},s={0:"Wanted Color",1:"Light Switch",2:"Whack-A-Image",3:"Picture Match"};function m(e){var t=Number(e.split("bt").pop());confirm("WARNING: Are you sure you want to reset your scores for "+s[t]+"? This cannot be undone.")&&(localStorage.removeItem(i[t]),location.reload())}function b(e){let t=[];if(localStorage.getItem(i[e])&&localStorage.getItem(i[e])!="[]")t=JSON.parse(localStorage.getItem(i[e]));else switch(e){case 0:t=c;break;case 1:t=n;break;case 2:t=g;break;case 3:t=u;break}let o=`
        <div class="card mx-auto" style="width: 18rem;">
        <div class="card-header text-white ${a[e]}">
            ${s[e]} High scores
        </div>
        <ul class="list-group list-group-flush">
            `,l=1;for(let r of t)o+=`<li class="list-group-item">${l}. ${r}</li>`,l++;o+=`</ul></div><button class="btn bt bg-dark text-light reset mb-3" id="bt${e}">Reset scores for ${s[e]}</button>`,document.getElementById(i[e]).innerHTML=o,document.querySelectorAll(".reset").forEach(function(r){r.onclick=function(){m(r.id)}})}for(let e=0;e<4;e++)b(e);

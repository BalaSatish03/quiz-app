const questions=[
    {question:"1. which year pi was discovered?",
        a:"2022",
        b:"2018",
        c:"2019",
        d:"2020",
     correct:"2019",
     type:"multiple"
       },
    {question:"2. what is the expected value of 1 pi?",
     a:"31$",
     b:"314$",
     c:"50$",
     d:"3140$",
     correct:"314$",
     type:"multiple"
    },
    {question:"3. Is kyc mandatory for pi?",
        a:"True",
        b:"False",
     correct:"True",
     type:"boolean"
       },
      
       {question:"4. what is expected year of pi mainet launch?",
        a:"2028",
        b:"2024",
        c:"2023",
        d:"2030",
     correct:"2024",
     type:"multiple"
       },
       {question:"5. who is founder of pi?",
        a:"nicolas kokkalis",
        b:"chengdiao fan",
        c:"Both a and b",
        d:"None of the Above",
     correct:"Both a and b",
     type:"multiple"
       }
];
const question=document.getElementById("question");
const a_text=document.getElementById("text_a");
const b_text=document.getElementById("text_b");
const c_text=document.getElementById("text_c");
const d_text=document.getElementById("text_d");
const btn=document.getElementById("submit");
const btn2=document.getElementById("Next");
const final_score=document.getElementById("f_score");
let i=0;
let score=0;

function loadQuiz(){
    question.innerHTML=questions[i]['question'];
    a_text.innerHTML=questions[i]['a'];
    b_text.innerHTML=questions[i]['b'];
    if(questions[i]['type']=='multiple'){
        c_text.style.display="inline-block";
        d_text.style.display="inline-block";
        document.getElementById("opt_c").style.display="inline-block";
        document.getElementById("opt_d").style.display="inline-block";
        c_text.innerHTML=questions[i]['c'];
        d_text.innerHTML=questions[i]['d'];
    }
    else{
        c_text.style.display="none";
        d_text.style.display="none";
        document.getElementById("opt_c").style.display="none";
        document.getElementById("opt_d").style.display="none";
    }
   

    

    
}
function handlebutton(event){
     
    const selectedOption = document.querySelector('input[name="myRadioGroup"]:checked');
    const ans=questions[i]['correct'];
    // Find the corresponding label using the for attribute
   
    if(selectedOption){
        const selectedOption_data=selectedOption.nextElementSibling.innerHTML;
        if(selectedOption_data==ans){
            score++;
        }

    i++;
    if(i<questions.length){
        loadQuiz();
        document.querySelectorAll('input[name="myRadioGroup"]').forEach(radio => radio.checked = false);

    }
    else if(i==questions.length){
        alert("quiz completed click on submit button to get final score");
    }
    else{
        finalscore();
    }
}
else{
    alert("please select an option");
}
}
function finalscore(event){

    fetch('/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }) // send score to server
    })
    
    document.querySelector('.div3').style.display="block";
    document.querySelector('.div4').style.display="block";
    document.querySelector('.content').style.display="none";
    document.querySelector('.div2').style.display="none";
    final_score.innerHTML="your score is: "+score+"/"+questions.length;

   


    
}

function returnhome(){
    window.location.href='home.html';
}






loadQuiz();
btn2.addEventListener('click',handlebutton);
btn.addEventListener('click',finalscore);
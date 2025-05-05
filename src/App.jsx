import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import parse from 'html-react-parser';

function App() 
{
  function round(number,place)
  {
    number*=Math.pow(10,place);
    number=Math.round(number);
    number/=Math.pow(10,place);
    return  number;
  }
  function get_unique_keys(arr,key)
  {
    let res=[];
    for(let item of arr)
    {
      res.push(item[key]);
    }
    console.log(res);
    res=new Set(res);
    return [...res];
  }
  function calculate_category_results(topic_arr)
  {
    let unique_categories=get_unique_keys(topic_arr,"category");
    console.log(unique_categories);

    let category_arr=[];
    for(let category of unique_categories)
    {
      let category_dict={};
      category_dict.category=category;
      category_dict.score=0;
      category_dict.count=0;

      for(let topic_dict of topic_arr)
      {
        if(topic_dict.category==category)
        {
          category_dict.score+=topic_dict.score;
          category_dict.count+=1;
        }
      }
      category_dict.average_score=round(category_dict.score/category_dict.count,2);
      category_arr.push(category_dict);
    }
    console.log(category_arr);

    let new_category_score_elements=category_arr.map(category_dict => <h3 key={category_dict.category}> {category_dict.category}: {category_dict.average_score}</h3>);
    setCategoryScoreElements(new_category_score_elements);
  }
  function calculate_score(topic_arr)
  {
    let score=0;
    console.log("Total Score: "+score);
    console.log(topic_arr);
    

    for(let topic_dict of topic_arr)
    {
      score+=topic_dict.score;
    }

    let new_score_elements=topic_arr.map(topic_dict => <p key={topic_dict.topic}>{topic_dict.category} {topic_dict.topic} {topic_dict.score}</p>);
    setScoreElements(new_score_elements);

    const new_average_score=round(score/topic_arr.length,2);
    setAverageScore(new_average_score);

  }
  function read_document(new_document_text_cleaned)
  {
    let lines=new_document_text_cleaned.split("<br>");
    lines=lines.map(line => line.replace("\t",""));
    lines=lines.map(line => line.trim());


    let topic_arr=[];
    let line_number=0;
    let category="";
    const END_LINE=lines.length-1;
    console.log(lines);
    while(line_number<=END_LINE)
    {
      while(!lines[line_number].includes("☐")&&!lines[line_number].includes("☒"))
      {
        if(lines[line_number].length>3)
        {
          //Make sure that lines that describe ratings are not counted as the category.
          if(!lines[line_number].includes("1 = Below Expectations"))
          {
            category=lines[line_number];
          }
        }

        line_number+=1;
        if(line_number>END_LINE)
        {
          break;
        }
      }

      if(line_number<=END_LINE)
      {
        let topic=lines[line_number].split(" 	")[0];
        topic=topic.replace("☒","");
        topic=topic.replace("☐","");
        topic=topic.trim();

        for(let i=0;i<5;i++)
        {
          if(lines[line_number+i].includes("☒"))
          {
            const item_score=((i+1)%5);
            const topic_dict={category:category,topic:topic,score:item_score};
            topic_arr.push(topic_dict);
            console.log(topic+" "+item_score);
            //break;
          }
        }
        line_number+=5;
      }
    }
    calculate_score(topic_arr);
    calculate_category_results(topic_arr);
  }
  function handleDocumentText(e)
  {
    let new_document_text=e.target.value;
    setDocumentText(new_document_text);

    let new_document_text_cleaned=new_document_text.replace(/\n/g,"<br>");
    setDocumentTextCleaned(new_document_text_cleaned);
    const document_html=parse(new_document_text_cleaned);
    setDocumentHTML(document_html);

    read_document(new_document_text_cleaned);
  }

  const [document_text,setDocumentText]=useState();
  const [document_text_cleaned,setDocumentTextCleaned]=useState();
  const [document_html,setDocumentHTML]=useState();
  const [score_elements,setScoreElements]=useState();
  const [category_score_elements,setCategoryScoreElements]=useState();
  const [average_score,setAverageScore]=useState();

  const information_html=(
    <>
    <h1>Student Evaluation Helper</h1>
    <h3>For Spectrum Works</h3>
    <h2>Steps</h2>
    <ol>
    <li>Copy all text from a Student Evaluation</li>
    <li>Paste all of the text into the textbox</li>
    <li>View the results</li>
    </ol>

    <h2>Main Idea</h2>
    <p>
    This website automatically calculates the overall average score and each category average score.
    This lets job coaches know where students are excelling and where they need improvement.
    This is very useful. This should help with calculating the results.
    </p>
    <h2>Steps</h2>
    <ol>
    <li>Copy <b>all text</b> from a Student Evaluation</li>
    <li>Copy by using Control-A and Control-C</li>
    <li>Paste all of the text into the textbox</li>
    <li>View the results</li>
    </ol>
    <h2>Key Results</h2>
    <ul>
    <li>Overall Average Score</li>
    <li>Category Average Scores</li>
    <li>Topic Score</li>
    </ul>
    </>
  );

  if(!document_html)
  {
    return (
      <>
        {information_html}
        <label htmlFor="document_text">Paste Document Text Here</label>
        <textarea id="document_text" onChange={handleDocumentText} value={document_text} rows={8} cols={40}></textarea>
        <h2>Add your Document to see Results</h2>
      </>
    );
  }

  return (
    <>      
      {information_html}
      <label htmlFor="document_text">Paste Document Text Here</label>
      <textarea id="document_text" onChange={handleDocumentText} value={document_text} rows={8} cols={40}></textarea>
      <h2>Average Score: {average_score}</h2>
      <h2>Category Scores</h2>
      {category_score_elements}
      <h2>Topic Scores</h2>
      {score_elements}
      <h2>Document Text</h2>
      {document_html}
    </>
  )
}

export default App

import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import useSound from 'use-sound';
import singl from '../src/Tito & Tarantula - After Dark.mp3';

type CardItem={
  value:number;
  identical:boolean;
}
const cardValue:CardItem[]=[
  {'value': 0, identical: false},
  {'value': 1, identical: false},
  {'value': 2, identical: false},
  {'value': 3, identical: false},
  {'value': 4, identical: false},
  {'value': 5, identical: false},
  {'value': 6, identical: false},
  {'value': 7, identical: false},
  {'value': 8, identical: false},
  {'value': 9, identical: false},
]

const App: React.FC=()=> {
  const [cards, setCards]=useState<(CardItem & {id:number})[]>([]);
  const [choiceOne, setChoiceOne]=useState<(CardItem & {id:number}) | null>(null);
  const [choiceTwo, setChoiceTwo]=useState<(CardItem & {id:number}) | null>(null);
  const [isDisabled, setIsDisabled]=useState(false);
  const [round, setRound]=useState(0);
  const [sound] = useSound(singl, { loop: true });
  const [record, setRecord]=useState<number | null>(null);
  
  const shuffleCards =()=>{
     const shuffledCards=[...cardValue, ...cardValue].sort(()=>Math.random()-0.5).map((card)=>({...card, id: Math.random()}))
     setCards(shuffledCards)
     setChoiceOne(null)
     setChoiceTwo(null)
     setRound(0)
  }
  
  const handleChoice=(card:CardItem & {id:number})=>{
     choiceOne ? setChoiceTwo(card) : setChoiceOne(card)    
    }
    
    useEffect(()=>{
    if(choiceOne && choiceTwo){
      setIsDisabled(true)
        if(choiceOne.value===choiceTwo.value){
            setCards(prev=>
                 prev.map(card=>
                    card.value===choiceOne.value?{...card, identical:true}: card
                    )
            )
    resetRound()
        }else{
            setTimeout(()=>resetRound(), 1000)
        }
    }
        }, [choiceOne, choiceTwo])
    
    
     const resetRound=()=>{
        setChoiceOne(null)
        setChoiceTwo(null)
        setIsDisabled(false)
        setRound(prev=>prev+1)
     }

     useEffect(()=>{
        shuffleCards()
        setRound(0)       
     }, [])

     useEffect(()=>{
      sound();       
   }, [sound]) 

   const saveRecord=(progress:number)=>{
    const stored=localStorage.getItem('record');
    const best = stored ? parseInt(stored) : null;
    if (best === null || progress < best) {
      localStorage.setItem('record', progress.toString());
    }
   }
   useEffect(() => {
    const stored = localStorage.getItem('record');
    if (stored) {
      setRecord(parseInt(stored));
    }
  }, [cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.identical)) {
      saveRecord(round);
    }
  }, [cards]);

  const resetBest=()=>{
    localStorage.removeItem('record');
    setRecord(null);
  }

  const ending=(count:number, forms:[string, string, string])=>{
    const rest100 = count % 100;
    const rest10 = count % 10;
  if (rest100 >= 11 && rest100 <= 14) {
    return forms[2];
  }
  if (rest10 === 1) {
    return forms[0];
  } else if (rest10 >= 2 && rest10 <= 4) {
    return forms[1];
  } else {
    return forms[2];
  }
};

  return (
    <div className="App">
      <h1>ВСПОМНИТЬ ВСЁ</h1>
      <button onClick={shuffleCards}>новая игра</button>
      <h4>всего ходов: {round}</h4>
      {record !==null &&
      <div className='btn'>
      <h5>рекорд: {record} {ending(record, ['ход', 'хода', 'ходов'])} </h5>
      <button className='reset' onClick={resetBest}>сброс</button>
      </div>}
      <div className='field'>
        {cards.map((card)=>(
          <Card key={card.id} 
          card={card} 
          handleChoice={handleChoice}
          open={card===choiceOne || card===choiceTwo || card.identical}
          isDisabled={isDisabled}/>
        ))}
      </div>
    </div>
  );
}

export default App;
